<script lang="ts">
  export let disabled = false;
  export let error = '';
  export let isValid = true;
  export let placeholder = '';
  export let rows = 5;
  export let spellcheck: boolean = null;
  export let value: string;
  export let label: string;
  export let labelHidden = false;
  export let id: string;
  export let required = false;
  export let description = '';

  let className = '';
  export { className as class };
</script>

<div class={className}>
  <label class:required class:sr-only={labelHidden} for={id}>{label}</label>
  {#if description}
    <p class="text-sm">{description}</p>
  {/if}
  <textarea
    class="min-h-fit w-full rounded border border-gray-900 py-2 px-3 font-mono text-sm"
    class:error={!isValid}
    {id}
    bind:value
    {disabled}
    {placeholder}
    {rows}
    {spellcheck}
    on:input
    on:change
    on:focus
    on:blur
    on:keydown|stopPropagation
  />
  <div class="error-msg" aria-live={isValid ? 'off' : 'assertive'}>
    {#if !isValid}
      {#if error}
        <p>{error}</p>
      {/if}
      <slot name="error" />
    {/if}
  </div>
</div>

<style lang="postcss">
  label {
    @apply mb-10 font-secondary text-sm font-medium;
  }

  label.required {
    @apply after:content-["*"];
  }

  .error {
    @apply border-danger;
  }

  .error-msg {
    @apply border-danger font-primary text-sm font-normal text-danger;
  }
</style>
