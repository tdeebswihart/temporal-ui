<script lang="ts">
  import { page } from '$app/stores';

  import Icon from '$lib/holocene/icon/icon.svelte';
  import Input from '$lib/holocene/input/input.svelte';
  import { Menu, MenuButton, MenuContainer } from '$lib/holocene/menu';
  import { translate } from '$lib/i18n/translate';
  import {
    attributeToHumanReadable,
    attributeToId,
    type TextFilterAttributes,
  } from '$lib/models/workflow-filters';
  import { workflowFilters } from '$lib/stores/filters';
  import { updateQueryParamsFromFilter } from '$lib/utilities/query/to-list-workflow-filters';

  let value = '';
  export let attribute: TextFilterAttributes;

  const getOtherFilters = () =>
    $workflowFilters.filter((f) => f.attribute !== attribute);

  $: idFilter = $workflowFilters.find((f) => f.attribute === attribute);

  const onInput = (e: Event) => {
    const { value } = e.target as HTMLInputElement;
    if (value) {
      const filter = {
        attribute,
        value,
        conditional: '=',
        operator: '',
        parenthesis: '',
      };
      $workflowFilters = [...getOtherFilters(), filter];
    } else {
      $workflowFilters = [...getOtherFilters()];
    }

    updateQueryParamsFromFilter($page.url, $workflowFilters);
  };

  function handleShowInput(event: CustomEvent<{ open: boolean }>) {
    const { open } = event.detail;
    if (open && idFilter?.value) {
      value = idFilter.value;
    } else if (open && !idFilter && value) {
      value = '';
    }
  }

  function handleClearInput() {
    $workflowFilters = [...getOtherFilters()];
    updateQueryParamsFromFilter($page.url, $workflowFilters);
  }
</script>

<MenuContainer>
  <MenuButton
    data-testid="{attributeToId[attribute]}-filter-button"
    variant="table-header"
    controls="{attributeToId[attribute]}-filter-menu"
    on:click={handleShowInput}
  >
    {attributeToHumanReadable[attribute]}
    <Icon name="filter" slot="trailing" />
  </MenuButton>
  <Menu keepOpen id="{attributeToId[attribute]}-filter-menu" class="w-[500px]">
    <Input
      icon="search"
      type="search"
      label={translate('common.search')}
      labelHidden
      id={attributeToId[attribute]}
      placeholder={attributeToHumanReadable[attribute]}
      class="flex items-center p-2 transition-all hover:cursor-pointer"
      autoFocus
      clearable
      clearButtonLabel={translate('common.clear-input-button-label')}
      on:input={onInput}
      on:clear={handleClearInput}
      bind:value
    />
  </Menu>
</MenuContainer>
