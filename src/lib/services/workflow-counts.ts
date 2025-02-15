import { noop } from 'svelte/internal';

import type { CountWorkflowExecutionsResponse } from '$lib/types/workflows';
import { requestFromAPI } from '$lib/utilities/request-from-api';
import { routeForApi } from '$lib/utilities/route-for-api';

export const fetchWorkflowCount = async (
  namespace: string,
  query: string,
  request = fetch,
): Promise<{ count: number }> => {
  let count = 0;
  try {
    const countRoute = routeForApi('workflows.count', { namespace });
    const result = await requestFromAPI<{ count: string }>(countRoute, {
      params: query ? { query } : {},
      onError: noop,
      handleError: noop,
      request,
    });
    count = parseInt(result?.count);
  } catch (e) {
    // Don't fail the workflows call due to count
  }

  return { count };
};

type WorkflowCountByExecutionStatusOptions = {
  namespace: string;
  query: string;
};

export const fetchWorkflowCountByExecutionStatus = async ({
  namespace,
  query,
}: WorkflowCountByExecutionStatusOptions): Promise<CountWorkflowExecutionsResponse> => {
  const groupByClause = 'GROUP BY ExecutionStatus';
  const countRoute = routeForApi('workflows.count', {
    namespace,
  });
  const { count, groups } =
    await requestFromAPI<CountWorkflowExecutionsResponse>(countRoute, {
      params: {
        query: query ? `${query} ${groupByClause}` : `${groupByClause}`,
      },
      notifyOnError: false,
    });
  return { count, groups };
};
