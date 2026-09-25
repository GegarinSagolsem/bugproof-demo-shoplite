import { renderCatalog } from "./catalogView";
import { $ } from "./dom";

let query = "";
let page = 1;

function render(): void {
  renderCatalog({
    query,
    page,
    onPage: (next) => {
      page = next;
      render();
    },
  });
}

const search = $<HTMLInputElement>("#search");
search.addEventListener("input", () => {
  query = search.value;
  page = 1;
  render();
});

render();
