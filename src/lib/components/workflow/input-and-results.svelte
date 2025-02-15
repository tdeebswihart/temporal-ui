<script lang="ts">
  import Badge from '$lib/holocene/badge.svelte';
  import CodeBlock from '$lib/holocene/code-block.svelte';
  import { translate } from '$lib/i18n/translate';
  import type { Payload } from '$lib/types/events';
  import type { PotentiallyDecodable } from '$lib/utilities/decode-payload';
  import {
    parseWithBigInt,
    stringifyWithBigInt,
  } from '$lib/utilities/parse-with-big-int';

  import PayloadDecoder from '../event/payload-decoder.svelte';

  export let content: string;
  export let title: string;

  $: parsedContent = parseContent(content);
  $: payloads = getPayloads(parsedContent);
  $: showParsedContent = payloads.length > 0;
  $: showParsedContentCount = payloads.length > 1;

  const parseContent = (c: string): PotentiallyDecodable | undefined => {
    try {
      return parseWithBigInt(c);
    } catch {
      return undefined;
    }
  };

  const parsePayloads = (c: string): unknown[] => {
    try {
      const data = parseWithBigInt(c);
      return Array.isArray(data) ? parseWithBigInt(c) : [];
    } catch {
      return [];
    }
  };

  const getPayloads = (value: PotentiallyDecodable | undefined): Payload[] => {
    try {
      const payloads = value?.payloads;
      return Array.isArray(payloads) ? payloads : [];
    } catch {
      return [];
    }
  };
</script>

<article class="flex w-full flex-col lg:w-1/2" {...$$restProps}>
  <h3 class="mb-2 flex items-center gap-2 text-lg">
    {title}
    {#if showParsedContentCount}
      <Badge type="count" class="rounded-sm">{payloads.length}</Badge>
    {/if}
  </h3>
  {#if content}
    <div class="flex h-full flex-col overflow-scroll lg:max-h-[24rem]">
      {#if showParsedContent}
        <PayloadDecoder value={parsedContent} key="payloads" let:decodedValue>
          {#each parsePayloads(decodedValue) as decodedContent}
            <CodeBlock
              content={stringifyWithBigInt(decodedContent)}
              class="mb-2"
              copyIconTitle={translate('common.copy-icon-title')}
              copySuccessIconTitle={translate('common.copy-success-icon-title')}
            />
          {/each}
        </PayloadDecoder>
      {:else}
        <PayloadDecoder value={parseWithBigInt(content)} let:decodedValue>
          <CodeBlock
            content={decodedValue}
            class="mb-2 lg:max-h-[23.5rem]"
            copyIconTitle={translate('common.copy-icon-title')}
            copySuccessIconTitle={translate('common.copy-success-icon-title')}
          />
        </PayloadDecoder>
      {/if}
    </div>
  {:else}
    <CodeBlock
      content="Results will appear upon completion."
      language="text"
      class="mb-2 lg:max-h-[24rem]"
      copyable={false}
    />
  {/if}
</article>
