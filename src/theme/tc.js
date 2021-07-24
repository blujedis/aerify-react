new Vue({

  el: '#app', data: { color: '#fafafa', numShades: 10, selectedIndex: 4 }, computed: {
    previewStyleIn: function () {
      var color = this.color
      if (this.color.length == 0) { color = "#fafafa" }
      return "background-color: " + tinycolor(color).toRgbString() + ";"
    }, previewStyleOut: function () { return this.shadesMonochrome[this.selectedIndex] },

    colorOut: function () {
      var color = tinycolor(this.shadesMonochrome[this.selectedIndex])
      return { hex: color.toHexString(), rgb: color.toRgbString(), hsl: color.toHslString(), hsv: color.toHsvString() }
    },

    shadesMonochrome: function () {

      var shades = []
      var color = this.color

      if (this.color.length == 0) { 
        color = "#fafafa" 
      }

      var hsl = tinycolor(color).toHsl()

      for (var i = this.numShades - 1; i >= 0; i -= 1) { 
        hsl.l = (i + 0.5) / this.numShades; 
        shades.push("background-color: " + tinycolor(hsl).toRgbString()) 
      }
      
      return shades

    }

  },

  methods: {
    copy: function (text, event) {
      var selection = window.getSelection()
      selection.removeAllRanges()
      event.target.setSelectionRange(0, event.target.value.length)
      document.execCommand('copy')
      swal({ title: "Copied!", text: text, timer: 3000, showConfirmButton: true, html: true });
    },

    random: function () { this.color = tinycolor.random().toHexString() }
  },

  created: function () {
    var hash = window.location.hash
    if (hash.length === 0) { this.random() }
    else { this.color = hash }
  },

  watch: {
    color: function () {
      var hash = tinycolor(this.color).toHexString().substring(1)
      window.location.hash = '#' + encodeURIComponent(hash)
    }
  }

})