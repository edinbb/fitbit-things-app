export class ListHandler {
  constructor(el) {
    this.listEl = el;
    this.onmap = undefined;
    this.onclick = undefined;
  }
  
  generateList(data) {
    if (data && data.length === 0) return;
    
    let onmap = this.onmap;
    let onclick = this.onclick;   
    this.listEl.delegate = {
      getTileInfo: function(index) {
        return {
          type: "pool",
          index: index
        };
      },
      configureTile: function(tile, info) {
        if (info.type !== "pool") return;
        onmap(tile, data[info.index]);
        tile.getElementById("tile-touch").onclick = (evt) => {
          onclick(data[info.index]);
        };
      }
    }; 
    this.listEl.length = data.length;
    this.listEl.animate("enable"); 
  }
  
  hideList() {
    this.listEl.animate("disable");
  }
}