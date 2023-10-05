import {CollectionEntry, getCollection} from "astro:content";

export async function getSortedPosts() {
    const allBlogPosts = await getCollection("posts");
    const sorted = allBlogPosts.sort((a, b) => {
        const dateA = new Date(a.data.pubDate);
        const dateB = new Date(b.data.pubDate);
        return dateA > dateB ? -1 : 1;
    });

    for (let i = 1; i < sorted.length; i++) {
        sorted[i].data.nextSlug = sorted[i - 1].slug;
        sorted[i].data.nextTitle = sorted[i - 1].data.title;
    }
    for (let i = 0; i < sorted.length - 1; i++) {
        sorted[i].data.prevSlug = sorted[i + 1].slug;
        sorted[i].data.prevTitle = sorted[i + 1].data.title;
    }

    return sorted;
}

export function getPostUrlBySlug(slug: string): string | null {
    if (!slug)
        return null;
    return `/posts/${slug}`;
}

export async function getTagList(): Promise<{ name: string; count: number }[]> {
    const allBlogPosts = await getCollection("posts");

    const countMap: { [key: string]: number } = {};
    allBlogPosts.map((post) => {
        post.data.tags.map((tag: string) => {
            if (!countMap[tag]) countMap[tag] = 0;
            countMap[tag]++;
        })
    });

    // sort tags
    const keys: string[] = Object.keys(countMap).sort(function (a, b) {
        var textA = a.toLowerCase();
        var textB = b.toLowerCase();
        if (textA < textB) {
            return -1;
        }
        if (textA > textB) {
            return 1;
        }
        return 0;
    });

    return keys.map((key) => ({name: key, count: countMap[key]}));
}