export default function Graph(){};
Graph.prototype.getChildren = function(){
   this._children = this.children || this._children ||[];
   return this._children ;
};
Graph.prototype.getChild = function(i){
   return this._children[i];
};
Graph.prototype.adopt = function(child){
   if(child._parent=== this)
      return;
   this._children = this._children||[];
   this._children.indexOf(child)<0 && this._children.push(child);
   child._parent=== this || (child._parent= this);
};
Graph.prototype.follow =function (parent){
   if(this._parent=== parent)
      return;
   parent.adopt(kid);
   // Get rid of the tranformation before stick
   child._initParentInverseMatrix= inverse(this.getWorldMatrix());
}
Graph.prototype.free = function(child){
   this._children.splice(this._children.indexOf(sprite),1);
}
Graph.prototype.setScene = function(scene){
   this._scene = scene;
   if(this._children ==null)
      return;
   const children = this._children;
   for(var i=0,l = children.length;i<l;i++)
      children[i].setScene(scene);
}
