import { HfInference } from "@huggingface/inference";
const axios = require('axios');

export interface LLMResult<T> {
  status: 'ok' | 'error';
  result: {
    [x: string]: T;
  };
}

export class HuggingFaceAPI {
  private inference: HfInference;
  private baseURL: string
  constructor() {
    this.inference = new HfInference(process.env.HF_TOKEN);
    this.baseURL = 'https://api-inference.huggingface.co/models/';
  }

  async isToxic(inputs): Promise<LLMResult<boolean>> {
    const toxicUrl = `${this.baseURL}martin-ha/toxic-comment-model`;
    try {
      const response = await axios.post(
        toxicUrl,
        { inputs },
        {
          headers: {
            Authorization: `Bearer ${process.env.HF_TOKEN}`,
          },
        }
      );

      return {
        status: 'ok',
        result: {
          isToxic: response.data[0].find((result) => result.label === 'toxic').score > 0.5,
        }
      };
    } catch (error) {
      console.error('Error calling Hugging Face API:', error);
      return {
        status: 'error',
        result: error.message || error,
      };
    }
  }

  async generateAdvice(inputs): Promise<LLMResult<string>> {
    const modelId = "mistralai/Mixtral-8x7B-Instruct-v0.1";

    try {
      const out = await this.inference.chatCompletion({
        model: modelId,
        messages: [{ role: "user", content: `You have a really good sense of humour. Give a good and humourous advised for a software engineer, who have this problem: ${inputs}. Please answer only with the advised` }],
        max_tokens: 300
      });

      return {
        status: 'ok',
        result: {
          advise: out.choices[0].message.content.split('\n').slice(1).join('\n') || out.choices[0].message.content || 'Good luck!',
        }
      }
    } catch (error) {
      console.error('Error calling Hugging Face API:', error);
      return {
        status: 'error',
        result: error.message || error,
      };
    }
  }
}
