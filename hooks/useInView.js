import { useEffect, useState } from "react";

export function useInView(targetRef, { root = null, rootMargin = "0px", threshold = 0 } = {}) {
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const node = targetRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;

    const rootNode = root && "current" in root ? root.current : root;

    const observer = new IntersectionObserver(
      ([observerEntry]) => setEntry(observerEntry),
      { root: rootNode, rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [targetRef, root, rootMargin, JSON.stringify(threshold)]);

  return entry;
}
