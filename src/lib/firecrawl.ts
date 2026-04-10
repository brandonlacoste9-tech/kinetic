export interface ScrapedGymInfo {
  name?: string;
  description?: string;
  amenities?: string[];
  manifesto_raw?: string;
  website_url?: string;
}

export async function scrapeGymInfo(url: string): Promise<ScrapedGymInfo | null> {
  const apiKey = import.meta.env.VITE_FIRECRAWL_API_KEY;
  if (!apiKey) {
    console.error("FIRECRAWL_API_KEY is missing");
    return null;
  }

  try {
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
        onlyMainContent: true
      })
    });

    if (!response.ok) {
      throw new Error(`Firecrawl error: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "Failed to scrape");
    }

    // Return the raw markdown for Gemini to process
    return {
      website_url: url,
      manifesto_raw: result.data.markdown,
      description: result.data.metadata?.description,
      name: result.data.metadata?.title
    };
  } catch (error) {
    console.error("Scrape failed:", error);
    return null;
  }
}
