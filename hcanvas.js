(function () {
  let size = [100, 25];
  let brushSize = 3;
  let char = "h";
  let erasing = false;
  let change = false;

  window.state = [...new Array(size[1])].map((_, row) =>
    [...new Array(size[0])].map((_, col) => {
      let _value = false;

      const el = document.createElement("span");
      el.dataset.row = row;
      el.dataset.col = col;
      el.textContent = " ";

      const value = (v) => {
        if (v == undefined) {
          return _value;
        }
        el.textContent = v ? char : " ";
        _value = v;
      };

      el.addEventListener("mousemove", (event) => {
        if (change) {
          value(!erasing);
          // Find all within brush size (distance)
          const distance = Math.floor(brushSize / 2);
          const height = Math.floor(brushSize / 3);
          for (let i = -height; i <= height; i++) {
            for (let j = -distance; j <= distance; j++) {
              if (
                row + i >= 0 &&
                row + i < size[1] &&
                col + j >= 0 &&
                col + j < size[0]
              ) {
                const v = state[row + i][col + j].value;
                v(!erasing);
              }
            }
          }
        }
      });

      return { value, el };
    })
  );

  const oldSizePicker = document.getElementById("size-picker");
  oldSizePicker?.remove();
  const sizePicker = document.createElement("input");
  sizePicker.id = "size-picker";
  sizePicker.type = "number";
  sizePicker.min = 1;
  sizePicker.max = 100;
  sizePicker.value = 3;
  sizePicker.addEventListener("change", (event) => {
    brushSize = parseInt(event.target.value);
  });
  document.body.appendChild(sizePicker);

  const oldCharPicker = document.getElementById("char-picker");
  oldCharPicker?.remove();
  const charPicker = document.createElement("input");
  charPicker.id = "char-picker";
  charPicker.type = "text";
  charPicker.value = char;
  charPicker.addEventListener("change", (event) => {
    char = event.target.value[0] ?? char;
  });
  document.body.appendChild(charPicker);

  const oldResetButton = document.querySelector("button");
  oldResetButton?.remove();
  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset";
  resetButton.addEventListener("click", () => {
    state.forEach((row) =>
      row.forEach(({ value }) => {
        value(false);
      })
    );
  });
  document.body.appendChild(resetButton);

  const oldEraseButton = document.getElementById("erase-button");
  oldEraseButton?.remove();
  const eraseButton = document.createElement("button");
  eraseButton.id = "erase-button";
  eraseButton.textContent = "Erase";
  eraseButton.addEventListener("click", () => {
    erasing = !erasing;
    eraseButton.textContent = erasing ? "Draw" : "Erase";
  });
  document.body.appendChild(eraseButton);

  const oldCopyButton = document.getElementById("copy-button");
  oldCopyButton?.remove();
  const copyButton = document.createElement("button");
  copyButton.id = "copy-button";
  copyButton.textContent = "Copy";
  copyButton.addEventListener("click", () => {
    const text = state
      .map((row) => row.map((col) => col.el.innerText).join(""))
      .join("\n");
    navigator.clipboard.writeText(text);
  });
  document.body.appendChild(copyButton);

  const old = document.getElementById("hcanvas");
  old?.remove();
  const pre = document.createElement("pre");
  pre.id = "hcanvas";
  pre.style.userSelect = "none";
  document.body.appendChild(pre);

  pre.replaceChildren(
    ...state.map((row, i) => {
      const parent = document.createElement("div");
      parent.replaceChildren(
        ...row.map((col, j) => {
          return col.el;
        })
      );
      return parent;
    })
  );

  pre.addEventListener("mousedown", () => {
    change = true;
  });

  pre.addEventListener("mouseup", () => {
    change = false;
  });

  pre.style.border = "1px solid black";
  pre.style.padding = "4px";
  pre.style.width = "max-content";
  pre.style.display = "block";

  function setSize() {
    const { width, height } = document.body.getBoundingClientRect();
    const min = Math.min((width / size[0]) * 1.7, height / size[1]);
    pre.style.fontSize = `${min}px`;
  }

  window.addEventListener("resize", (event) => {
    setSize();
  });
})();
