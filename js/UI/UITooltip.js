class UITooltip {
    constructor() {
        this.tooltipElement = null;
    }

    createTooltip() {
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.className = 'tooltip-content';
        document.body.appendChild(this.tooltipElement);
    }

    showTooltip(data) {
        let e = data.event;
        let content = data.content;

        if (!this.tooltipElement) {
            this.createTooltip();
        }
        this.tooltipElement.style.top = e.pageY + 'px';
        this.tooltipElement.style.left = e.pageX + 'px';
        this.tooltipElement.textContent = content;
        this.tooltipElement.style.display = 'block';
    }

    hideTooltip() {
        if (this.tooltipElement) {
            this.tooltipElement.style.display = 'none';
        }
    }
}

export default UITooltip;