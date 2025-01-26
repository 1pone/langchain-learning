import model from "./models/openAI.ts";

const message = await model.invoke("What is the capital of France?");

console.log(message);

// const message = {
//   id: "chatcmpl-AskYDuRMLIC0eskSz2OiUylhzMzlS",
//   content: "The capital of France is Paris.",
//   additional_kwargs: {},
//   response_metadata: {
//     tokenUsage: {
//       promptTokens: 14,
//       completionTokens: 7,
//       totalTokens: 21,
//     },
//     finish_reason: "stop",
//     model_name: "gpt-4o-mini-2024-07-18",
//     usage: {
//       prompt_tokens: 14,
//       completion_tokens: 7,
//       total_tokens: 21,
//       completion_tokens_details: {
//         audio_tokens: 0,
//         reasoning_tokens: 0,
//       },
//       prompt_tokens_details: {
//         audio_tokens: 0,
//         cached_tokens: 0,
//       },
//     },
//     system_fingerprint: "fp_5154047bf2",
//   },
//   tool_calls: [],
//   invalid_tool_calls: [],
//   usage_metadata: {
//     output_tokens: 7,
//     input_tokens: 14,
//     total_tokens: 21,
//     input_token_details: {
//       audio: 0,
//       cache_read: 0,
//     },
//     output_token_details: {
//       audio: 0,
//       reasoning: 0,
//     },
//   },
// };
