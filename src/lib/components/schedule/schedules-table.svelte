<script>
  import TableHeaderRow from '$lib/holocene/table/table-header-row.svelte';
  import Table from '$lib/holocene/table/table.svelte';
  import { translate } from '$lib/i18n/translate';
</script>

<Table class="w-full table-fixed">
  <caption class="sr-only" slot="caption"
    >{translate('common.schedules')}</caption
  >
  <TableHeaderRow slot="headers">
    <th class="w-28">{translate('common.status')}</th>
    <th class="md:w-80 xl:w-auto">{translate('schedules.name')}</th>
    <th class="w-60 max-md:hidden xl:w-80"
      >{translate('common.workflow-type')}</th
    >
    <th class="w-56 max-xl:hidden">{translate('schedules.recent-runs')}</th>
    <th class="w-56 max-xl:hidden">{translate('schedules.upcoming-runs')}</th>
  </TableHeaderRow>
  <slot />
</Table>
