import { z } from 'genkit';
import { ai } from '..';

const InputSchema = z.object({
  userSentence: z.string().describe('The sentence provided by the user'),
  vocabularyList: z
    .array(z.string())
    .describe(
      'A list of English vocabulary that you must include in your response',
    ),
  topic: z.string().describe("The topic related to the user's sentence"),
  userLevel: z.string().describe("The user's English proficiency level"),
  userProfile: z
    .string()
    .describe('A brief description of the user in Vietnamese'),
});

const OutputSchema = z.object({
  reply: z.string().describe("Your English response to the user's sentence"),
  correction: z
    .string()
    .optional()
    .describe("A corrected version of the user's sentence in proper English"),
  grammarTip: z
    .string()
    .optional()
    .describe(
      'A short description (in Vietnamese) explaining the grammar mistake',
    ),
  suggestedVocabulary: z
    .array(
      z.object({
        word: z.string().describe('An English word or phrase'),
        phonetic: z
          .string()
          .optional()
          .describe('Phonetic transcription of the word'),
        example: z
          .string()
          .optional()
          .describe('Example sentence using the word'),
        meaning: z
          .string()
          .describe('Vietnamese meaning of the word or phrase'),
        meaningExample: z
          .string()
          .optional()
          .describe('Example sentence using the word in Vietnamese'),
      }),
    )
    .describe(
      'A list of English words or phrases the user should learn, including phonetics, examples, and Vietnamese meanings',
    ),
  translatedReply: z
    .string()
    .describe('The English reply translated into Vietnamese'),
  userProfileSummary: z
    .string()
    .describe('A short summary about the user written in Vietnamese'),
});

export type TInputChatGemini = z.infer<typeof InputSchema>;

export type TOutputChatGemini = z.infer<typeof OutputSchema>;

export async function chat(
  input: TInputChatGemini,
): Promise<TOutputChatGemini> {
  return Flow(input);
}

const checkPrompt = ai.definePrompt({
  name: 'checkAndReplyPrompt',
  input: { schema: InputSchema },
  output: { schema: OutputSchema },
  prompt: `You are a friendly and encouraging conversation partner.

You will receive a sentence from the user: {{{userSentence}}}

Your tasks:
1. **Generate \`reply\`:**
   - Respond to the sentence \`{{{userSentence}}}\` in **English**, using **15 to 20 words**.
   - **Incorporate** the provided vocabulary: {{{vocabularyList}}}
   - Align your response with the **topic** {{{topic}}} and the user’s **English level** {{{userLevel}}}
   - Prefer using **open-ended questions** or engaging replies to continue the conversation naturally.

2. **Provide \`correction\`:**
   - Correct the grammar in \`{{{userSentence}}}\` and return a **fixed version** in English.

3. **Provide \`grammarTip\`:**
   - Write a **short explanation in Vietnamese** (about 1–2 sentences) describing the grammar mistake and why the correction was made.

4. **Return \`suggestedVocabulary\`:**
   - Based on both \`{{{userSentence}}}\` and \`correction\`, suggest relevant **English words or phrases** the user should learn, including **phonetics** and **example sentences** if possible.

5. **Return \`translatedReply\`:**
   - Translate your \`reply\` into **Vietnamese**.

6. **Return \`userProfileSummary\`:**
   - Based on {{{userProfile}}} and {{{userSentence}}}, generate a **brief Vietnamese description** summarizing the user's background or context.
`,
});

const Flow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
  },
  async (input) => {
    const { output } = await checkPrompt(input);
    return output!;
  },
);
