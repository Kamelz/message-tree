(function() {

    var graph = new joint.dia.Graph;
    var paper = new joint.dia.Paper({ el: $('#paper-html-elements'), width: 850, height: 600, gridSize: 1, model: graph });

// Create a custom element.
// ------------------------

    joint.shapes.html = {};
    joint.shapes.html.Element = joint.shapes.basic.Rect.extend({
        defaults: joint.util.deepSupplement({
            type: 'html.Element',
            attrs: {
                rect: { stroke: 'none', 'fill-opacity': 0 }
            }
        }, joint.shapes.basic.Rect.prototype.defaults)
    });

// Create a custom view for that element that displays an HTML div above it.
// -------------------------------------------------------------------------

    joint.shapes.html.ElementView = joint.dia.ElementView.extend({

        template: [
            '<div class="html-element">',
            '<button class="delete">x</button>',
            '<label></label>',
            // '<div class="row"> <div class="col-xs-12 "> Enter your age.</div></div>',
            '<br/>',
            '<span></span>', '<br/>',
            '<select id="gender"><option>--</option><option>Male</option><option>Female</option></select>',
            '<input type="number" style="display:none" class="form-control"/>',
            '</div>'
        ].join(''),

        initialize: function() {
            _.bindAll(this, 'updateBox');
            joint.dia.ElementView.prototype.initialize.apply(this, arguments);

            this.$box = $(_.template(this.template)());
            // Prevent paper from handling pointerdown.
            this.$box.find('input,select').on('mousedown click', function(evt) {
                evt.stopPropagation();
            });

             this.$box.find('select').on('change', _.bind(function(evt) {
                // this.model.set('select', $(evt.target).val());
                  var gender = $(evt.target).val();
                  if(gender =="Male"){
                    DrawNewBox(this,40,40,170,100,"Enter your age","block","none");
                  }
                  else if(gender =="Female"){
                    DrawNewBox(this,40,40,170,100,"Enter your age","block","none");
                  }

            }, this));


            // This is an example of reacting on the input change and storing the input data in the cell model.
            this.$box.find('input').on('change', _.bind(function(evt) {
                
                  var age=$(evt.target).val();
                  console.log($(evt.target).val());
                  if(age >=10 && age <=20){
                     DrawNewBox(this,10,10,170,100,"Nic","none","none");
                  }
                  else if(age >=21 && age <=30){
                     DrawNewBox(this,10,10,170,100,"Thanks","none","none");
                  }
                

            }, this));
           
            this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
            // Update the box position whenever the underlying model changes.
            this.model.on('change', this.updateBox, this);
            // Remove the box when the model gets removed from the graph.
            this.model.on('remove', this.removeBox, this);

            this.updateBox();
        },
        render: function() {
            joint.dia.ElementView.prototype.render.apply(this, arguments);
            this.paper.$el.prepend(this.$box);
            this.updateBox();
            return this;
        },
        updateBox: function() {

            // Set the position and dimension of the box so that it covers the JointJS element.
            var bbox = this.model.getBBox();
            // Example of updating the HTML with a data stored in the cell model.
            this.$box.find('input').css("display",this.model.get("InputView"));
            this.$box.find('select').css("display",this.model.get("SelectView"));
            this.$box.find('label').text(this.model.get('label'));
            this.$box.find('span').text(this.model.get('select'));
            this.$box.css({
                width: bbox.width,
                height: bbox.height,
                left: bbox.x,
                top: bbox.y,
                transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
            });
        },
        removeBox: function(evt) {
            this.$box.remove();
        }
    });

// Create JointJS elements and add them to the graph as usual.
// -----------------------------------------------------------

    var Question = new joint.shapes.html.Element({
        position: {x:10, y:10},
        size: { width: 170, height: 100 },
        label: 'Gender?',
        InputView:"none",
        SelectView:"block"
    });
// console.log(Question);

    var DrawNewBox = function(BoxObject,x,y,w,h,label,InputDisplay,SelectDisplay){
      
        var el2 = new joint.shapes.html.Element({
            position: { x: x, y: y },
            size: { width: w, height: h },
            label: label,
            InputView:InputDisplay,
            SelectView:SelectDisplay
        });

        console.log(BoxObject.model.id);
        console.log(el2.id);

        var link = new joint.dia.Link({
          source: { id: el2.id },
          target: { id: BoxObject.model.id },
          attrs: { '.connection': { 'stroke-width': 5, stroke: '#34495E' } }
        });

         graph.addCells([el2,link]);
          //BoxObject.find("input").css("display","block");
    };


    // var l = new joint.dia.Link({
    //     source: { id: el1.id },
    //     target: { id: el2.id },
    //     attrs: { '.connection': { 'stroke-width': 5, stroke: '#34495E' } }
    // });

    graph.addCells([Question]);

}())