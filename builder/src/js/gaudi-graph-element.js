/*global $,joint,_,g*/
joint.shapes.html = {};

joint.shapes.html.GaudiGraphComponent = joint.shapes.basic.Rect.extend({
    defaults: joint.util.deepSupplement({
        type: 'html.Element',
        attrs: {
            rect: { stroke: 'none', 'fill-opacity': 0 }
        }
    }, joint.shapes.basic.Rect.prototype.defaults)
});

joint.shapes.html.ElementView = joint.dia.ElementView.extend({

    link: null,
    canUpdateLink: false,

    template: [
        '<div class="component">',
        '<div class="element"></div>',
        '<div class="tools">',
        '<button class="edit glyphicon glyphicon-wrench" data-container="body"></button>',
        '<div class="create-link glyphicon glyphicon-record"></div>',
        '<button class="close">&times;</button>',
        '</div>',
        '</div>'
    ].join(''),

    initialize: function () {
        _.bindAll(this, 'updateBox');
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);

        this.$box = $(_.template(this.template)());

        this.model.on('change', this.updateBox, this);
        this.model.on('remove', this.removeBox, this);

        this.updateBox();
    },
    render: function () {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
        this.paper.$el.prepend(this.$box);
        this.updateBox();

        this.$box.find('.create-link').on('mousedown', this.createLink.bind(this));
        this.$box.find('.edit').on('click', this.triggerOpenDetail.bind(this));
        this.$box.find('.close').on('click', _.bind(this.model.remove, this.model));
        this.$box.attr('data-type', this.model.get('componentType'));
        this.$box.find('.element').html(this.model.get('label'));

        this.paper.$el.mousemove(this.onMouseMove.bind(this));
        this.paper.$el.mouseup(this.onMouseUp.bind(this));

        this.updateName();

        return this;
    },

    updateName: function () {
        this.$box.find('.name').html(this.model.get('name'));
    },

    updateBox: function () {
        var bbox = this.model.getBBox();

        this.updateName();

        this.$box.css({ width: bbox.width, height: bbox.height, left: bbox.x, top: bbox.y, transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)' });
    },

    removeBox: function (evt) {
        this.model.trigger('onRemove');

        this.$box.remove();
    },

    triggerOpenDetail: function (e) {
        e.preventDefault();

        this.model.trigger('onOpenDetail');
    },

    createLink: function (evt) {
        var self = this,
            paperOffset = this.paper.$el.offset(),
            targetOffset = $(evt.target).offset(),
            x = targetOffset.left - paperOffset.left,
            y = targetOffset.top  - paperOffset.top;

        this.link = new joint.dia.Link({
            source: {id: this.model.get('id')},
            target: g.point(x, y),
            z: -1,
            attrs: {
                '.connection': { stroke: '#49ae80', 'stroke-width': 6, opacity: 0.5 },
                '.marker-target': { stroke: '#49ae80', fill: '#49ae80', 'stroke-width': 2, d: 'M 10 0 L 0 5 L 10 10 z' },
                '.marker-source': { stroke: '#49ae80', fill: '#49ae80', 'stroke-width': 2, d: 'M 10 0 L 0 5 L 10 10 z' },
                '.marker-vertices': {display: 'none'}
            }
        });
        this.paper.model.addCell(this.link);

        // marker arrow color change
        this.link.on('remove', function (lnk) {
            self.model.trigger('removeLink', lnk.get('source').id, lnk.get('target').id);
        });

        this.link.on('change:target', function (lnk) {
            var target = lnk.get('target');

            // Check if the second arrow is uppon a rect at the first d&d (at the second jointjs will handle it correctly)
            if (typeof (target.id) === 'undefined') {
                var rect = self.paper.findViewsFromPoint(g.point(target.x, target.y))[0];
                if (!rect || lnk.get('source').id === rect.model.get('id')) {
                    return;
                }

                target = rect;
                target.$el.addClass('arrowOver');
                lnk.set('target', {id: target.model.get('id')});
                return;
            }

            self.model.trigger('createLink', target.id);
        });

        this.canUpdateLink = true;
    },

    onMouseUp: function () {
        this.canUpdateLink = false;
        this.paper.$el.find('.component').css("z-index", 1);
    },

    onMouseMove: function (evt) {
        if (!this.link || !this.canUpdateLink || evt.offsetX <= 10) {
            return;
        }

        this.link.set('target', g.point(evt.offsetX, evt.offsetY));
    }
});
