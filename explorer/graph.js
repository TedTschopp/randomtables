(function (root) {
  'use strict';

  class AtlasGraph {
    constructor(element, onSelect) {
      this.element = element;
      this.onSelect = onSelect;
      this.svg = d3.select(element).attr('role', 'group');
      this.stage = element.parentElement;
      this.tooltip = document.getElementById('graph-tooltip');
      this.transform = d3.zoomIdentity;
      this.tracedNodes = new Set();
      this.tracedEdges = new Set();
      this.colors = new Map(TableAtlas.collections.map(collection => [collection.id, collection.color]));
      this.colors.set('missing', '#b86754');
      const definitions = this.svg.append('defs');
      for (const [name, color] of [['normal', '#bacdc0'], ['active', '#589c79'], ['missing', '#bd8b7b'], ['trace', '#187d58']]) {
        definitions.append('marker').attr('id', `atlas-arrow-${name}`)
          .attr('viewBox', '0 -4 8 8').attr('refX', 7).attr('refY', 0)
          .attr('markerWidth', 6).attr('markerHeight', 6).attr('orient', 'auto')
          .append('path').attr('d', 'M0,-3L7,0L0,3Z').attr('fill', color);
      }
      this.layer = this.svg.append('g').attr('class', 'graph-content');
      this.edgeLayer = this.layer.append('g');
      this.nodeLayer = this.layer.append('g');
      this.zoom = d3.zoom().scaleExtent([0.12, 6]).on('zoom', event => {
        this.transform = event.transform;
        this.layer.attr('transform', event.transform);
        this.updateLabels();
        this.tooltip.hidden = true;
      });
      this.svg.call(this.zoom);
      new ResizeObserver(() => {
        if (this.nodes && this.nodes.length) this.fit(false);
      }).observe(this.stage);
    }

    render(model, data, selectedId, scope) {
      if (this.simulation) this.simulation.stop();
      this.model = model;
      this.selectedId = selectedId;
      this.scope = scope;
      this.hoveredId = null;
      this.tracedNodes.clear();
      this.tracedEdges.clear();
      this.tooltip.hidden = true;
      const visibleIds = new Set(data.nodes.map(node => node.id));
      const distances = new Map([[selectedId, 0]]);
      const queue = [selectedId];
      for (let cursor = 0; cursor < queue.length; cursor += 1) {
        const table = model.byId.get(queue[cursor]);
        if (!table) continue;
        for (const neighbor of [...table.incoming, ...table.outgoing]) {
          if (visibleIds.has(neighbor) && !distances.has(neighbor)) {
            distances.set(neighbor, distances.get(table.id) + 1);
            queue.push(neighbor);
          }
        }
      }
      const groups = [...model.collections.map(collection => collection.id), 'missing'];
      this.nodes = data.nodes.map((node, index) => {
        const group = groups.indexOf(node.collection);
        const hop = distances.get(node.id) || 0;
        const angle = index * 2.399963;
        const targetX = scope === 'all' ? (group % 3 - 1) * 280 : Math.cos(angle) * hop * 140;
        const targetY = scope === 'all' ? (Math.floor(group / 3) - 1) * 240 : Math.sin(angle) * hop * 140;
        return {
          ...node, hop, targetX, targetY,
          degree: node.outgoing.length + node.incoming.length,
          x: targetX + Math.cos(angle) * 18, y: targetY + Math.sin(angle) * 18,
          radius: scope === 'all' ? 3 + Math.min(4, Math.sqrt(node.outgoing.length + node.incoming.length)) : node.id === selectedId ? 14 : hop === 1 ? 8 : 5
        };
      });
      this.links = data.edges.map(edge => ({ ...edge }));
      const selected = this.nodes.find(node => node.id === selectedId);
      if (selected && scope === 'focus') {
        selected.fx = 0;
        selected.fy = 0;
      }
      this.edges = this.edgeLayer.selectAll('path').data(this.links, edge => `${edge.source}\0${edge.target}`).join('path')
        .attr('class', 'graph-edge').attr('fill', 'none').attr('vector-effect', 'non-scaling-stroke');
      this.nodeGroups = this.nodeLayer.selectAll('g.graph-node').data(this.nodes, node => node.id).join(enter => {
        const group = enter.append('g').attr('class', 'graph-node');
        group.append('circle').attr('class', 'node-hit').attr('fill', 'transparent');
        group.append('circle').attr('class', 'node-ring').attr('fill', 'none');
        group.append('circle').attr('class', 'node-body');
        group.append('circle').attr('class', 'node-core').attr('fill', 'white');
        group.append('text').attr('class', 'node-label').attr('text-anchor', 'middle');
        return group;
      }).attr('role', 'button').attr('tabindex', node => scope === 'focus' || node.id === selectedId ? 0 : -1)
        .attr('data-table', node => node.id)
        .attr('aria-label', node => `${node.label}. ${node.missing ? 'Unresolved reference' : `${node.entries.length} entries, ${node.outgoing.length} outgoing, ${node.incoming.length} incoming references`}.`)
        .on('click', (event, node) => {
          event.stopPropagation();
          this.onSelect(node.id);
        })
        .on('keydown', (event, node) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.onSelect(node.id);
          }
        })
        .on('mouseenter focus', (event, node) => this.showTooltip(event, node))
        .on('mouseleave blur', () => {
          this.hoveredId = null;
          this.tooltip.hidden = true;
          this.updateLabels();
        });
      this.nodeGroups.select('.node-label').each(function (node) {
        const words = node.label.split(' ');
        const lines = [''];
        for (const word of words) {
          const last = lines.length - 1;
          if (lines[last] && (lines[last] + word).length > 21) lines.push(word);
          else lines[last] += `${lines[last] ? ' ' : ''}${word}`;
        }
        if (lines.length > 2) lines[1] += '...';
        d3.select(this).selectAll('tspan').data(lines.slice(0, 2)).join('tspan')
          .attr('x', 0).text(line => line.length > 26 ? `${line.slice(0, 23)}...` : line);
      });
      this.simulation = d3.forceSimulation(this.nodes).randomSource(d3.randomLcg(0.42)).stop()
        .force('link', d3.forceLink(this.links).id(node => node.id).distance(scope === 'all' ? 32 : 116).strength(scope === 'all' ? 0.22 : 0.4))
        .force('charge', d3.forceManyBody().strength(scope === 'all' ? -19 : -190).distanceMax(scope === 'all' ? 220 : 500))
        .force('collision', d3.forceCollide(node => scope === 'all' ? node.radius + 3 : this.nodes.length <= 18 || node.hop <= 1 ? 46 : 19).iterations(2))
        .alphaDecay(0.04);
      if (scope === 'all') {
        this.simulation.force('x', d3.forceX(node => node.targetX).strength(0.13))
          .force('y', d3.forceY(node => node.targetY).strength(0.13));
      } else {
        this.simulation.force('radial', d3.forceRadial(node => node.hop * 145, 0, 0).strength(0.65));
      }
      this.simulation.tick(scope === 'all' ? 180 : 150);
      this.simulation.on('tick', () => this.draw());
      this.nodeGroups.call(d3.drag()
        .on('start', (event, node) => {
          if (!event.active) this.simulation.alphaTarget(0.12).restart();
          node.fx = node.x;
          node.fy = node.y;
          this.tooltip.hidden = true;
        })
        .on('drag', (event, node) => { node.fx = event.x; node.fy = event.y; })
        .on('end', (event, node) => {
          if (!event.active) this.simulation.alphaTarget(0);
          if (scope !== 'focus' || node.id !== this.selectedId) { node.fx = null; node.fy = null; }
        }));
      this.updateStyles();
      this.draw();
      this.fit(false);
    }

    draw() {
      this.nodeGroups.attr('transform', node => `translate(${node.x},${node.y})`);
      this.edges.attr('d', edge => {
        const source = edge.source;
        const target = edge.target;
        if (source.id === target.id) return `M${source.x - 3},${source.y - source.radius}C${source.x - 45},${source.y - 65} ${source.x + 45},${source.y - 65} ${source.x + 3},${source.y - source.radius - 2}`;
        const differenceX = target.x - source.x;
        const differenceY = target.y - source.y;
        const distance = Math.hypot(differenceX, differenceY) || 1;
        const unitX = differenceX / distance;
        const unitY = differenceY / distance;
        const startX = source.x + unitX * (source.radius + 2);
        const startY = source.y + unitY * (source.radius + 2);
        const endX = target.x - unitX * (target.radius + 4);
        const endY = target.y - unitY * (target.radius + 4);
        return `M${startX},${startY}Q${(startX + endX) / 2 - differenceY * 0.06},${(startY + endY) / 2 + differenceX * 0.06} ${endX},${endY}`;
      });
    }

    select(id) {
      this.selectedId = id;
      this.tracedNodes.clear();
      this.tracedEdges.clear();
      this.updateStyles();
    }

    updateStyles() {
      this.nodeGroups.select('.node-hit').attr('r', node => Math.max(13, node.radius + 7));
      this.nodeGroups.select('.node-ring').attr('r', node => node.radius + 5)
        .attr('stroke', node => node.id === this.selectedId ? '#83b69a' : this.tracedNodes.has(node.id) ? '#7faf8c' : 'none')
        .attr('stroke-width', 1).attr('stroke-dasharray', node => node.missing ? '2,2' : null);
      this.nodeGroups.select('.node-body').attr('r', node => node.radius)
        .attr('fill', node => node.missing ? '#f8faf8' : this.tracedNodes.has(node.id) || node.id === this.selectedId ? '#168063' : this.colors.get(node.collection))
        .attr('stroke', node => node.missing ? '#b86754' : '#ffffff').attr('stroke-width', node => node.missing ? 1.5 : 1.8)
        .attr('stroke-dasharray', node => node.missing ? '2,2' : null);
      this.nodeGroups.select('.node-core').attr('r', node => node.id === this.selectedId && !node.missing ? 2 : 0);
      this.nodeGroups.attr('aria-pressed', node => String(node.id === this.selectedId));
      this.edges.attr('stroke', edge => this.edgeType(edge) === 'trace' ? '#35926b' : this.edgeType(edge) === 'active' ? '#8cb6a0' : this.edgeType(edge) === 'missing' ? '#d1a18f' : '#cbd8cf')
        .attr('stroke-width', edge => this.edgeType(edge) === 'trace' ? 2 : this.edgeType(edge) === 'active' ? 1.5 : 1)
        .attr('stroke-opacity', edge => this.edgeType(edge) === 'normal' ? this.scope === 'all' ? 0.45 : 0.75 : 1)
        .attr('stroke-dasharray', edge => edge.target.missing ? '3,4' : null)
        .attr('marker-end', edge => `url(#atlas-arrow-${this.edgeType(edge)})`);
      this.updateLabels();
    }

    edgeType(edge) {
      if (this.tracedEdges.has(`${edge.source.id}\0${edge.target.id}`)) return 'trace';
      if (edge.target.missing) return 'missing';
      if (edge.source.id === this.selectedId || edge.target.id === this.selectedId) return 'active';
      return 'normal';
    }

    updateLabels() {
      if (!this.nodeGroups) return;
      const scale = this.transform.k;
      this.nodeGroups.select('.node-label')
        .attr('display', node => node.id === this.selectedId || node.id === this.hoveredId || (this.scope === 'focus' && node.hop === 1 && this.nodes.length < 100) || (this.nodes.length <= 18 && scale > 0.6) || (this.scope === 'all' && scale > 1.4 && node.degree >= 6) || scale > 2.2 ? null : 'none')
        .attr('fill', node => node.id === this.selectedId ? '#2a5039' : node.missing ? '#a96653' : '#6d8172')
        .attr('class', node => `node-label${node.id === this.selectedId ? ' is-selected' : ''}`)
        .attr('y', node => node.radius + 14 / scale)
        .style('font-size', node => `${(node.id === this.selectedId ? 12 : 10) / scale}px`)
        .style('stroke-width', `${4 / scale}px`)
        .selectAll('tspan').attr('dy', (line, index) => index ? 13 / scale : 0);
    }

    showTooltip(event, node) {
      this.hoveredId = node.id;
      this.updateLabels();
      const title = document.createElement('strong');
      title.textContent = node.label;
      const details = document.createElement('small');
      details.textContent = node.missing ? 'Unresolved reference' : `${node.entries.length.toLocaleString()} entries / ${node.outgoing.length} uses / ${node.incoming.length} used by`;
      this.tooltip.replaceChildren(title, details);
      this.tooltip.hidden = false;
      const stage = this.stage.getBoundingClientRect();
      const nodeBounds = event.currentTarget.getBoundingClientRect();
      const clientX = Number.isFinite(event.clientX) ? event.clientX : nodeBounds.right;
      const clientY = Number.isFinite(event.clientY) ? event.clientY : nodeBounds.bottom;
      this.tooltip.style.left = `${Math.max(8, Math.min(clientX - stage.left + 12, stage.width - 240))}px`;
      this.tooltip.style.top = `${Math.max(8, Math.min(clientY - stage.top + 12, stage.height - 70))}px`;
    }

    fit(animate = true) {
      if (!this.nodes || !this.nodes.length) return;
      const width = this.stage.clientWidth;
      const height = this.stage.clientHeight;
      if (!width || !height) return;
      const horizontal = d3.extent(this.nodes, node => node.x);
      const vertical = d3.extent(this.nodes, node => node.y);
      const scale = Math.min(1.65, Math.max(0.12, Math.min((width - 100) / Math.max(180, horizontal[1] - horizontal[0] + 60), (height - 160) / Math.max(160, vertical[1] - vertical[0] + 60))));
      const centerX = (horizontal[0] + horizontal[1]) / 2;
      const centerY = (vertical[0] + vertical[1]) / 2;
      const transform = d3.zoomIdentity.translate(width / 2 - scale * centerX, height / 2 + 10 - scale * centerY).scale(scale);
      this.move(transform, animate);
    }

    move(transform, animate = true) {
      this.svg.interrupt();
      const selection = animate && !matchMedia('(prefers-reduced-motion: reduce)').matches ? this.svg.transition().duration(220) : this.svg;
      selection.call(this.zoom.transform, transform);
    }

    zoomBy(factor) {
      this.svg.interrupt();
      const selection = matchMedia('(prefers-reduced-motion: reduce)').matches ? this.svg : this.svg.transition().duration(180);
      selection.call(this.zoom.scaleBy, factor);
    }

    highlightTrace(steps) {
      this.tracedNodes.clear();
      this.tracedEdges.clear();
      const ancestors = [];
      for (const step of steps) {
        this.tracedNodes.add(step.id);
        ancestors.length = step.depth;
        if (step.depth && ancestors[step.depth - 1]) this.tracedEdges.add(`${ancestors[step.depth - 1]}\0${step.id}`);
        ancestors.push(step.id);
      }
      this.updateStyles();
    }

    serialize() {
      const clone = this.element.cloneNode(true);
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      clone.setAttribute('width', this.stage.clientWidth);
      clone.setAttribute('height', this.stage.clientHeight);
      clone.setAttribute('viewBox', `0 0 ${this.stage.clientWidth} ${this.stage.clientHeight}`);
      const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      style.textContent = '.node-label{font-family:sans-serif;paint-order:stroke;stroke:#f8faf8;stroke-linejoin:round;font-weight:500}.node-label.is-selected{font-weight:800}';
      clone.prepend(style);
      const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      background.setAttribute('width', '100%');
      background.setAttribute('height', '100%');
      background.setAttribute('fill', '#f8faf8');
      clone.prepend(background);
      return new XMLSerializer().serializeToString(clone);
    }
  }

  root.AtlasGraph = AtlasGraph;
})(globalThis);