function o(t){if(!t)return"";if(t.startsWith("http"))return t;const n=t.split("/"),r=encodeURIComponent(n.pop());return`/storage/${n.join("/")}/${r}`}export{o as g};
