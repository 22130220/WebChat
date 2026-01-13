const linkPreviewApiKey = import.meta.env.VITE_LINK_PREVIEW_API_KEY;
const linkPreviewEndpoint = import.meta.env.VITE_LINK_PREVIEW_ENDPOINT;

async function fetchLinkPreview(url: string) {
    const response = await fetch(`${linkPreviewEndpoint}?key=${linkPreviewApiKey}&q=${encodeURIComponent(url)}`);
    if (!response.ok) {
        throw new Error(`Error fetching link preview: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

export { fetchLinkPreview };