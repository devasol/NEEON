import { useEffect } from "react";

// A tiny global image loader that adds 'img--loading' while images are loading
// and removes it once the image has loaded or errored. It also supports
// swapping a tiny inline SVG placeholder or keeping CSS background placeholder.
export default function GlobalImageLoader() {
  useEffect(() => {
    if (typeof window === "undefined" || !("MutationObserver" in window))
      return;

    const markLoading = (img) => {
      if (!img) return;
      // If already loaded, ensure class removed
      if (img.complete && img.naturalWidth !== 0) {
        img.classList.remove("img--loading");
        return;
      }
      img.classList.add("img--loading");
      const onLoad = () => {
        img.classList.remove("img--loading");
        cleanup();
      };
      const onError = () => {
        img.classList.remove("img--loading");
        img.classList.add("img--error");
        cleanup();
      };
      function cleanup() {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
      }
      img.addEventListener("load", onLoad);
      img.addEventListener("error", onError);
    };

    // Observe existing <img> elements
    const imgs = Array.from(document.getElementsByTagName("img"));
    imgs.forEach(markLoading);

    // Observe future additions and attribute changes
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList") {
          m.addedNodes.forEach((node) => {
            if (node.nodeType !== 1) return;
            if (node.tagName === "IMG") markLoading(node);
            // also check for images inside added subtrees
            node.querySelectorAll &&
              node.querySelectorAll("img").forEach(markLoading);
          });
        } else if (m.type === "attributes" && m.target.tagName === "IMG") {
          markLoading(m.target);
        }
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "srcset"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
