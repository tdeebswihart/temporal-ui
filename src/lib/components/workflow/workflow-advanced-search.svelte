<script lang="ts">
  import { fade } from 'svelte/transition';
  import { fly } from 'svelte/transition';

  import { page } from '$app/stores';

  import Button from '$lib/holocene/button.svelte';
  import Input from '$lib/holocene/input/input.svelte';
  import { translate } from '$lib/i18n/translate';
  import { workflowFilters } from '$lib/stores/filters';
  import { refresh, workflowsQuery } from '$lib/stores/workflows';
  import { toListWorkflowFilters } from '$lib/utilities/query/to-list-workflow-filters';
  import { updateQueryParameters } from '$lib/utilities/update-query-parameters';

  let manualSearchString = '';

  $: query = $page.url.searchParams.get('query');

  function setManualString(query: string) {
    manualSearchString = query;
  }

  $: {
    setManualString(query);
  }

  const onSearch = () => {
    if (!manualSearchString) {
      $workflowFilters = [];
      $workflowsQuery = '';
    } else {
      try {
        $workflowFilters = toListWorkflowFilters(manualSearchString);
      } catch (e) {
        console.error(e);
      }
    }

    if (manualSearchString && manualSearchString === query) {
      $refresh = Date.now();
    } else {
      updateQueryParameters({
        url: $page.url,
        parameter: 'query',
        value: manualSearchString,
        allowEmpty: true,
      });
    }
  };

  function handleClearInput() {
    onSearch();
  }
</script>

<div class="flex grow gap-4">
  <div class="flex w-full items-center gap-0" in:fade>
    <form
      on:submit|preventDefault={onSearch}
      class="relative flex w-full items-center gap-0"
      in:fly={{ x: -100, duration: 150 }}
      role="search"
    >
      <Input
        id="manual-search"
        type="search"
        label={translate('workflows.search-placeholder')}
        labelHidden
        placeholder={translate('workflows.search-placeholder')}
        icon="search"
        class="w-full lg:w-3/4"
        clearable
        clearButtonLabel={translate('common.clear-input-button-label')}
        unroundRight
        on:clear={handleClearInput}
        bind:value={manualSearchString}
      />
      <Button
        data-testid="manual-search-button"
        variant="primary"
        borderRadiusModifier="square-left"
        type="submit"
      >
        {translate('common.search')}
      </Button>
    </form>
  </div>
</div>
