<script lang="ts" context="module">
  import { afterUpdate } from 'svelte/internal';
  import { writable, type Writable } from 'svelte/store';
  import { fly } from 'svelte/transition';

  import { setContext } from 'svelte';

  export const FILTER_CONTEXT = 'filter-context';

  export interface FilterContext {
    filter: Writable<WorkflowFilter>;
    activeQueryIndex: Writable<number>;
    handleSubmit: () => void;
    focusedElementId: Writable<string>;
    resetFilter: () => void;
  }
</script>

<script lang="ts">
  import { page } from '$app/stores';

  import WorkflowAdvancedSearch from '$lib/components/workflow/workflow-advanced-search.svelte';
  import Button from '$lib/holocene/button.svelte';
  import ToggleSwitch from '$lib/holocene/toggle-switch.svelte';
  import { translate } from '$lib/i18n/translate';
  import type { WorkflowFilter } from '$lib/models/workflow-filters';
  import { workflowFilters } from '$lib/stores/filters';
  import { refresh } from '$lib/stores/workflows';
  import {
    getFocusedElementId,
    isBooleanFilter,
    isDateTimeFilter,
    isNumberFilter,
    isStatusFilter,
    isTextFilter,
  } from '$lib/utilities/query/filter-search';
  import { toListWorkflowQueryFromFilters } from '$lib/utilities/query/filter-workflow-query';
  import {
    combineFilters,
    emptyFilter,
  } from '$lib/utilities/query/to-list-workflow-filters';
  import { updateQueryParameters } from '$lib/utilities/update-query-parameters';

  import BooleanFilter from './boolean-filter.svelte';
  import CloseFilter from './close-filter-button.svelte';
  import DateTimeFilter from './datetime-filter.svelte';
  import FilterList from './filter-list.svelte';
  import NumberFilter from './number-filter.svelte';
  import SearchAttributeMenu from './search-attribute-menu.svelte';
  import StatusFilter from './status-filter.svelte';
  import TextFilter from './text-filter.svelte';
  const filter = writable<WorkflowFilter>(emptyFilter());
  const activeQueryIndex = writable<number>(null);
  const focusedElementId = writable<string>('');

  $: searchParamQuery = $page.url.searchParams.get('query');
  $: showClearAllButton = $workflowFilters.length && !$filter.attribute;

  let viewAdvancedSearchInput = false;

  setContext<FilterContext>(FILTER_CONTEXT, {
    filter,
    activeQueryIndex,
    handleSubmit,
    focusedElementId,
    resetFilter,
  });

  function onSearch() {
    const searchQuery = toListWorkflowQueryFromFilters(
      combineFilters($workflowFilters),
    );

    if (searchQuery && searchQuery === searchParamQuery) {
      $refresh = Date.now();
    } else {
      updateQueryParameters({
        url: $page.url,
        parameter: 'query',
        value: searchQuery,
        allowEmpty: true,
      });
    }
  }

  function handleSubmit() {
    if ($activeQueryIndex !== null) {
      $workflowFilters[$activeQueryIndex] = $filter;
      $activeQueryIndex = null;
    } else {
      $workflowFilters = [...$workflowFilters, $filter];
    }
    filter.set(emptyFilter());
    onSearch();
  }

  function handleClearInput() {
    $workflowFilters = [];
    onSearch();
  }

  function updateFocusedElementId() {
    if ($activeQueryIndex !== null) {
      $focusedElementId = getFocusedElementId($filter.attribute);
    }
  }

  $: $activeQueryIndex, updateFocusedElementId();

  function updateFocus() {
    if ($focusedElementId) {
      const element = document.getElementById($focusedElementId);
      if (element) {
        element.focus();
        if (element instanceof HTMLButtonElement) {
          element.click();
        }
      }
    }
  }

  afterUpdate(() => {
    updateFocus();
  });

  function resetFilter() {
    activeQueryIndex.set(null);
    filter.set(emptyFilter());
  }

  function handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape' && !isTextFilter($filter.attribute)) {
      resetFilter();
    }
  }
</script>

<div class="flex grow flex-col">
  <div class="flex grow flex-col gap-4 sm:flex-row sm:items-center">
    {#if viewAdvancedSearchInput}
      <WorkflowAdvancedSearch />
    {:else}
      <div
        class="flex items-center"
        class:filter={!showClearAllButton}
        on:keyup={handleKeyUp}
      >
        {#if isStatusFilter($filter.attribute)}
          <StatusFilter />
        {:else}
          <SearchAttributeMenu />
        {/if}

        {#if isTextFilter($filter.attribute)}
          <div
            class="flex w-full items-center"
            in:fly={{ x: -100, duration: 150 }}
          >
            <TextFilter />
            <CloseFilter />
          </div>
          <!-- TODO: Add KeywordList support -->
          <!-- {:else if isListFilter($filter.attribute)}
        <div class="w-full" in:fly={{ x: -100, duration: 150 }}>
          <ListFilter />
        </div> -->
        {:else if isNumberFilter($filter.attribute)}
          <div
            class="flex w-full items-center"
            in:fly={{ x: -100, duration: 150 }}
          >
            <NumberFilter />
            <CloseFilter />
          </div>
        {:else if isDateTimeFilter($filter.attribute)}
          <div
            class="flex w-full items-center"
            in:fly={{ x: -100, duration: 150 }}
          >
            <DateTimeFilter />
            <CloseFilter />
          </div>
        {:else if isBooleanFilter($filter.attribute)}
          <div
            class="flex w-full items-center"
            in:fly={{ x: -100, duration: 150 }}
          >
            <BooleanFilter />
            <CloseFilter />
          </div>
        {/if}
      </div>

      <div
        class="flex flex-col sm:flex-row {showClearAllButton
          ? 'w-full justify-between'
          : 'justify-end'}"
      >
        {#if showClearAllButton}
          <Button variant="ghost" on:click={handleClearInput}
            >{translate('common.clear-all')}</Button
          >
        {/if}
      </div>
    {/if}
    <ToggleSwitch
      label={translate('workflows.view-search-input')}
      labelPosition="left"
      id="view-search-input"
      bind:checked={viewAdvancedSearchInput}
      on:change={() => {
        resetFilter();
      }}
    />
  </div>
  <FilterList />
</div>

<style lang="postcss">
  .filter {
    @apply grow;
  }
</style>
