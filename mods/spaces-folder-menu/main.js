import { View, div, svg } from "gpui-kit";
import { h_flex, v_flex } from "gpui-base";
import { theme, run, props, closeOverlay, pickFolder, notify } from "herdr";

export default class SpacesFolderMenu extends View {
  row(id, icon, label, action, keepOpen = false) {
    const t = theme();
    return h_flex().id(id).h(31).px(9).gap(10).rounded(7).items_center().flex_none()
      .text_color(t.foreground).hover(s => s.bg(t.selected))
      .on_click(() => { if (!keepOpen) closeOverlay(props().overlay); action(); })
      .child(icon).child(div().flex_1().child(label));
  }

  render() {
    const t = theme();
    return v_flex().w_full().bg(t.popover).p(5).text_size(12.8)
      .child(this.row("new-space-folder", svg("mods/workspace-chrome/folder.svg").size(14), "New Space from Folder", async () => {
        try {
          const folder = await pickFolder({ prompt: "Choose a folder for the new space" });
          closeOverlay(props().overlay);
          if (folder !== null) run("space.new", { folder, machine: "" });
        } catch (error) {
          closeOverlay(props().overlay);
          notify({ title: "Could not choose folder", body: String(error), level: "error" });
        }
      }, true))
      .child(this.row("new-space", svg("mods/workspace-chrome/plus.svg").size(14), "New Space", () => run("space.new")));
  }
}
