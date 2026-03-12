import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import { Prompt } from "@/utils/prompts.js";
import {
  OpenActivityTag,
  OpenSequenceTag,
  CloseSequenceTag,
  CloseActivityTag,
} from "@/utils/BoilerPlate.js";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3-flash-preview",
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request) {
  console.log("Analyze route hit");
  const formData = await request.formData();
  const steps = formData.get("automateSteps");
  console.log("Received steps:", steps);

  try {
    const response = await model.invoke([
      ["system", Prompt],
      ["human", `<steps>${steps}</steps>`],
    ]);

    const parsed = JSON.parse(response.content);
    console.log("XAML response:", response.content);

    return Response.json({
      xaml:
        OpenActivityTag +
        "\n" +
        OpenSequenceTag +
        parsed.xaml +
        "\n" +
        CloseSequenceTag +
        "\n" +
        CloseActivityTag,
    });
  } catch (error) {
    console.error("Error generating AI response:", error);
    return Response.json(
      { error: error.message },
      { status: error.status || 500 },
    );
  }
}