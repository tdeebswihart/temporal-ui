<script lang="ts">
  import { page } from '$app/stores';

  import Button from '$lib/holocene/button.svelte';
  import CodeBlock from '$lib/holocene/code-block.svelte';
  import EmptyState from '$lib/holocene/empty-state.svelte';
  import Loading from '$lib/holocene/loading.svelte';
  import Option from '$lib/holocene/select/simple-option.svelte';
  import Select from '$lib/holocene/select/simple-select.svelte';
  import ToggleSwitch from '$lib/holocene/toggle-switch.svelte';
  import { translate } from '$lib/i18n/translate';
  import {
    getQuery,
    getQueryTypes,
    type ParsedQuery,
  } from '$lib/services/query-service';
  import { authUser } from '$lib/stores/auth-user';
  import { stringifyWithBigInt } from '$lib/utilities/parse-with-big-int';

  const { namespace, workflow: workflowId, run: runId } = $page.params;

  const params = {
    id: workflowId,
    runId,
  };

  let queryType: string;
  let isLoading = false;

  let queryTypes = getQueryTypes({
    namespace,
    workflow: params,
  }).then((queryTypes) => {
    queryType = queryType || queryTypes[0];
    return queryTypes;
  });

  let queryResult: Promise<ParsedQuery>;

  const query = (queryType: string) => {
    queryResult = getQuery(
      {
        namespace,
        workflow: params,
        queryType,
      },
      $page.data?.settings,
      $authUser?.accessToken,
    );
  };

  $: {
    queryType && query(queryType);
  }

  let jsonFormatting = true;
</script>

<section>
  {#await queryTypes}
    <div class="text-center">
      <Loading />
      <p>{translate('workflows.no-workers-failure-message')}</p>
    </div>
  {:then types}
    <div class="flex justify-between">
      <div class="flex items-center gap-4">
        <Select
          id="query-select"
          label={translate('workflows.query-type')}
          bind:value={queryType}
          data-testid="query-select"
        >
          {#each types as value}
            <Option {value}>{value}</Option>
          {/each}
        </Select>
        <Button
          on:click={() => query(queryType)}
          leadingIcon="retry"
          loading={isLoading}
        >
          {translate('common.refresh')}
        </Button>
      </div>
      <div class="flex justify-end">
        <ToggleSwitch
          label={translate('workflows.json-formatting')}
          labelPosition="left"
          id="json-formatting"
          checked={jsonFormatting}
          on:change={() => (jsonFormatting = !jsonFormatting)}
        />
      </div>
    </div>
    <div class="my-2 flex h-full items-start">
      {#await queryResult then result}
        {@const content =
          typeof result !== 'string' ? stringifyWithBigInt(result) : result}
        <CodeBlock
          {content}
          language={jsonFormatting ? 'json' : 'text'}
          copyIconTitle={translate('common.copy-icon-title')}
          copySuccessIconTitle={translate('common.copy-success-icon-title')}
        />
      {/await}
    </div>
  {:catch _error}
    <EmptyState
      title={translate('common.error-occurred')}
      content={translate('workflows.no-workers-running-message')}
      error={_error?.message}
    />
  {/await}
</section>
