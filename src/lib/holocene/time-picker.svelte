<script lang="ts">
  import Input from '$lib/holocene/input/input.svelte';
  import ToggleButton from '$lib/holocene/toggle-button/toggle-button.svelte';
  import ToggleButtons from '$lib/holocene/toggle-button/toggle-buttons.svelte';

  export let hour = '';
  export let minute = '';
  export let second = '';
  export let half: 'AM' | 'PM' = 'AM';
  export let twelveHourClock = true;
  export let disabled = false;
</script>

<div class="flex gap-2">
  <Input
    id="hour"
    label="hrs"
    labelHidden
    bind:value={hour}
    placeholder="00"
    suffix="hrs"
    maxLength={2}
    error={twelveHourClock ? parseInt(hour) > 12 : parseInt(hour) > 23}
    {disabled}
  />
  <Input
    id="minute"
    label="min"
    labelHidden
    required
    bind:value={minute}
    placeholder="00"
    suffix="min"
    maxLength={2}
    error={Boolean(parseInt(hour) > 59)}
    {disabled}
  />
  <Input
    id="second"
    label="sec"
    labelHidden
    bind:value={second}
    placeholder="00"
    suffix="sec"
    maxLength={2}
    error={Boolean(parseInt(hour) > 59)}
    {disabled}
  />
  {#if twelveHourClock}
    <ToggleButtons>
      <ToggleButton active={half === 'AM'} on:click={() => (half = 'AM')}
        >AM</ToggleButton
      >
      <ToggleButton active={half === 'PM'} on:click={() => (half = 'PM')}
        >PM</ToggleButton
      >
    </ToggleButtons>
  {/if}
</div>
