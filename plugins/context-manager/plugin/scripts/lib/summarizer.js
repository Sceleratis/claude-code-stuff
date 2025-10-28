/**
 * Recursive Summarizer
 * Uses Claude API to summarize chunks recursively until reaching target size
 */
import Anthropic from '@anthropic-ai/sdk';
import { messagesToText } from './chunker.js';
/**
 * Estimate tokens in text
 */
function estimateTokens(text) {
    return Math.ceil(text.length / 4);
}
/**
 * Create a summarizer instance
 */
export class Summarizer {
    client;
    model;
    maxTokens;
    targetSummaryTokens;
    constructor(options) {
        this.client = new Anthropic({ apiKey: options.apiKey });
        this.model = options.model || 'claude-sonnet-4-20250514';
        this.maxTokens = options.maxTokens || 4096;
        this.targetSummaryTokens = options.targetSummaryTokens || 5000;
    }
    /**
     * Summarize a single chunk of conversation
     */
    async summarizeChunk(chunk) {
        const text = messagesToText(chunk.messages);
        const prompt = `You are summarizing a portion of a conversation between a user and Claude Code (an AI coding assistant).

Your task is to create a comprehensive but concise summary that preserves:
1. Key decisions and choices made
2. Important code changes and their purposes
3. Problems solved and bugs fixed
4. Important discoveries or learnings
5. Any ongoing work or next steps

Focus on technical substance. Omit conversational pleasantries and meta-discussion.

Conversation chunk to summarize:

${text}

Provide a concise summary in markdown format:`;
        const response = await this.client.messages.create({
            model: this.model,
            max_tokens: this.maxTokens,
            messages: [{
                    role: 'user',
                    content: prompt
                }]
        });
        const summaryText = response.content[0].type === 'text' ? response.content[0].text : '';
        return {
            text: summaryText,
            tokenEstimate: estimateTokens(summaryText),
            sourceChunkIds: [chunk.id],
            level: 1
        };
    }
    /**
     * Merge and summarize multiple summaries
     */
    async summarizeSummaries(summaries) {
        const combinedText = summaries.map(s => s.text).join('\n\n---\n\n');
        const sourceChunkIds = summaries.flatMap(s => s.sourceChunkIds);
        const level = Math.max(...summaries.map(s => s.level)) + 1;
        const prompt = `You are creating a higher-level summary by combining multiple summaries from a conversation between a user and Claude Code.

Your task is to synthesize these summaries into one coherent summary that:
1. Maintains all critical information (decisions, code changes, bugs fixed)
2. Groups related topics together
3. Eliminates redundancy
4. Preserves important technical details
5. Tracks overall progress and outcomes

Combined summaries to synthesize:

${combinedText}

Provide a comprehensive synthesis in markdown format:`;
        const response = await this.client.messages.create({
            model: this.model,
            max_tokens: this.maxTokens,
            messages: [{
                    role: 'user',
                    content: prompt
                }]
        });
        const summaryText = response.content[0].type === 'text' ? response.content[0].text : '';
        return {
            text: summaryText,
            tokenEstimate: estimateTokens(summaryText),
            sourceChunkIds,
            level
        };
    }
    /**
     * Recursively summarize chunks until target size is reached
     */
    async recursiveSummarize(chunks, progressCallback) {
        if (chunks.length === 0) {
            throw new Error('No chunks to summarize');
        }
        // Step 1: Summarize each chunk
        progressCallback?.(`Summarizing ${chunks.length} chunks...`);
        let summaries = [];
        for (let i = 0; i < chunks.length; i++) {
            progressCallback?.(`Processing chunk ${i + 1}/${chunks.length}...`);
            const summary = await this.summarizeChunk(chunks[i]);
            summaries.push(summary);
            // Small delay to avoid rate limits
            if (i < chunks.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        // Step 2: Recursively merge summaries if needed
        let level = 1;
        while (summaries.length > 1) {
            const totalTokens = summaries.reduce((sum, s) => sum + s.tokenEstimate, 0);
            if (totalTokens <= this.targetSummaryTokens && summaries.length <= 3) {
                // Close enough to target, do final merge
                progressCallback?.(`Creating final summary from ${summaries.length} summaries...`);
                return await this.summarizeSummaries(summaries);
            }
            // Group summaries into batches for merging
            const batchSize = 3; // Merge 3 summaries at a time
            const newSummaries = [];
            for (let i = 0; i < summaries.length; i += batchSize) {
                const batch = summaries.slice(i, i + batchSize);
                progressCallback?.(`Merging summaries ${i + 1}-${Math.min(i + batchSize, summaries.length)} (level ${level + 1})...`);
                const merged = await this.summarizeSummaries(batch);
                newSummaries.push(merged);
                // Small delay to avoid rate limits
                if (i + batchSize < summaries.length) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
            summaries = newSummaries;
            level++;
        }
        return summaries[0];
    }
}
