// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.
import * as tslib_1 from "tslib";
import { Vector } from '../vector';
var NestedView = /** @class */ (function () {
    function NestedView(data, children) {
        this.length = data.length;
        this.childData = data.childData;
        this.numChildren = data.childData.length;
        this._children = children || new Array(this.numChildren);
    }
    NestedView.prototype.clone = function (data) {
        return new this.constructor(data, this._children);
    };
    NestedView.prototype.isValid = function () {
        return true;
    };
    NestedView.prototype.toArray = function () {
        return tslib_1.__spread(this);
    };
    NestedView.prototype.indexOf = function (_) {
        throw new Error("Not implemented yet");
    };
    NestedView.prototype.toJSON = function () { return this.toArray(); };
    NestedView.prototype.toString = function () {
        return tslib_1.__spread(this).map(function (x) { return stringify(x); }).join(', ');
    };
    NestedView.prototype.get = function (index) {
        return this.getNested(this, index);
    };
    NestedView.prototype.set = function (index, value) {
        return this.setNested(this, index, value);
    };
    NestedView.prototype.getChildAt = function (index) {
        return index < 0 || index >= this.numChildren
            ? null
            : this._children[index] ||
                (this._children[index] = Vector.create(this.childData[index]));
    };
    NestedView.prototype[Symbol.iterator] = function () {
        var get, length, index;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    get = this.getNested;
                    length = this.length;
                    index = -1;
                    _a.label = 1;
                case 1:
                    if (!(++index < length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, get(this, index)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    };
    return NestedView;
}());
export { NestedView };
var UnionView = /** @class */ (function (_super) {
    tslib_1.__extends(UnionView, _super);
    function UnionView(data, children) {
        var _this = _super.call(this, data, children) || this;
        _this.length = data.length;
        _this.typeIds = data.typeIds;
        return _this;
    }
    UnionView.prototype.getNested = function (self, index) {
        return self.getChildValue(self, index, self.typeIds, self.valueOffsets);
    };
    UnionView.prototype.setNested = function (self, index, value) {
        return self.setChildValue(self, index, value, self.typeIds, self.valueOffsets);
    };
    UnionView.prototype.getChildValue = function (self, index, typeIds, _valueOffsets) {
        var child = self.getChildAt(typeIds[index]);
        return child ? child.get(index) : null;
    };
    UnionView.prototype.setChildValue = function (self, index, value, typeIds, _valueOffsets) {
        var child = self.getChildAt(typeIds[index]);
        return child ? child.set(index, value) : null;
    };
    UnionView.prototype[Symbol.iterator] = function () {
        var length, get, _a, typeIds, valueOffsets, index;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    length = this.length;
                    get = this.getChildValue;
                    _a = this, typeIds = _a.typeIds, valueOffsets = _a.valueOffsets;
                    index = -1;
                    _b.label = 1;
                case 1:
                    if (!(++index < length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, get(this, index, typeIds, valueOffsets)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3: return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    };
    return UnionView;
}(NestedView));
export { UnionView };
var DenseUnionView = /** @class */ (function (_super) {
    tslib_1.__extends(DenseUnionView, _super);
    function DenseUnionView(data, children) {
        var _this = _super.call(this, data, children) || this;
        _this.valueOffsets = data.valueOffsets;
        return _this;
    }
    DenseUnionView.prototype.getNested = function (self, index) {
        return self.getChildValue(self, index, self.typeIds, self.valueOffsets);
    };
    DenseUnionView.prototype.getChildValue = function (self, index, typeIds, valueOffsets) {
        var child = self.getChildAt(typeIds[index]);
        return child ? child.get(valueOffsets[index]) : null;
    };
    DenseUnionView.prototype.setChildValue = function (self, index, value, typeIds, valueOffsets) {
        var child = self.getChildAt(typeIds[index]);
        return child ? child.set(valueOffsets[index], value) : null;
    };
    return DenseUnionView;
}(UnionView));
export { DenseUnionView };
var StructView = /** @class */ (function (_super) {
    tslib_1.__extends(StructView, _super);
    function StructView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StructView.prototype.getNested = function (self, index) {
        return new RowView(self, self._children, index);
    };
    StructView.prototype.setNested = function (self, index, value) {
        var idx = -1, len = self.numChildren, child;
        if (!(value instanceof NestedView || value instanceof Vector)) {
            while (++idx < len) {
                if (child = self.getChildAt(idx)) {
                    child.set(index, value[idx]);
                }
            }
        }
        else {
            while (++idx < len) {
                if (child = self.getChildAt(idx)) {
                    child.set(index, value.get(idx));
                }
            }
        }
    };
    return StructView;
}(NestedView));
export { StructView };
var MapView = /** @class */ (function (_super) {
    tslib_1.__extends(MapView, _super);
    function MapView(data, children) {
        var _this = _super.call(this, data, children) || this;
        _this.typeIds = data.type.children.reduce(function (xs, x, i) {
            return (xs[x.name] = i) && xs || xs;
        }, Object.create(null));
        return _this;
    }
    MapView.prototype.getNested = function (self, index) {
        return new MapRowView(self, self._children, index);
    };
    MapView.prototype.setNested = function (self, index, value) {
        var typeIds = self.typeIds, child;
        if (!(value instanceof NestedView || value instanceof Vector)) {
            for (var key in typeIds) {
                if (child = self.getChildAt(typeIds[key])) {
                    child.set(index, value[key]);
                }
            }
        }
        else {
            for (var key in typeIds) {
                if (child = self.getChildAt(typeIds[key])) {
                    child.set(index, value.get(key));
                }
            }
        }
    };
    return MapView;
}(NestedView));
export { MapView };
var RowView = /** @class */ (function (_super) {
    tslib_1.__extends(RowView, _super);
    function RowView(data, children, rowIndex) {
        var _this = _super.call(this, data, children) || this;
        _this.rowIndex = rowIndex || 0;
        _this.length = data.numChildren;
        return _this;
    }
    RowView.prototype.clone = function (data) {
        return new this.constructor(data, this._children, this.rowIndex);
    };
    RowView.prototype.getChildValue = function (self, index, _typeIds, _valueOffsets) {
        var child = self.getChildAt(index);
        return child ? child.get(self.rowIndex) : null;
    };
    RowView.prototype.setChildValue = function (self, index, value, _typeIds, _valueOffsets) {
        var child = self.getChildAt(index);
        return child ? child.set(self.rowIndex, value) : null;
    };
    return RowView;
}(UnionView));
export { RowView };
var MapRowView = /** @class */ (function (_super) {
    tslib_1.__extends(MapRowView, _super);
    function MapRowView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MapRowView.prototype.toJSON = function () {
        var get = this.getChildValue;
        var result = {};
        var typeIds = this.typeIds;
        for (var name_1 in typeIds) {
            result[name_1] = get(this, name_1, typeIds, null);
        }
        return result;
    };
    MapRowView.prototype.getChildValue = function (self, key, typeIds, _valueOffsets) {
        var child = self.getChildAt(typeIds[key]);
        return child ? child.get(self.rowIndex) : null;
    };
    MapRowView.prototype.setChildValue = function (self, key, value, typeIds, _valueOffsets) {
        var child = self.getChildAt(typeIds[key]);
        return child ? child.set(self.rowIndex, value) : null;
    };
    return MapRowView;
}(RowView));
export { MapRowView };
function stringify(x) {
    return typeof x === 'string' ? "\"" + x + "\"" : Array.isArray(x) ? JSON.stringify(x) : ArrayBuffer.isView(x) ? "[" + x + "]" : "" + x;
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQUksQ0FBQyxNQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUcsQ0FBRyxDQUFDO0FBQy9ILENBQUMiLCJmaWxlIjoidmVjdG9yL25lc3RlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIExpY2Vuc2VkIHRvIHRoZSBBcGFjaGUgU29mdHdhcmUgRm91bmRhdGlvbiAoQVNGKSB1bmRlciBvbmVcbi8vIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiAgU2VlIHRoZSBOT1RJQ0UgZmlsZVxuLy8gZGlzdHJpYnV0ZWQgd2l0aCB0aGlzIHdvcmsgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb25cbi8vIHJlZ2FyZGluZyBjb3B5cmlnaHQgb3duZXJzaGlwLiAgVGhlIEFTRiBsaWNlbnNlcyB0aGlzIGZpbGVcbi8vIHRvIHlvdSB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGVcbi8vIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZVxuLy8gd2l0aCB0aGUgTGljZW5zZS4gIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLFxuLy8gc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW5cbi8vIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXG4vLyBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbi8vIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnNcbi8vIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG5pbXBvcnQgeyBEYXRhIH0gZnJvbSAnLi4vZGF0YSc7XG5pbXBvcnQgeyBWaWV3LCBWZWN0b3IgfSBmcm9tICcuLi92ZWN0b3InO1xuaW1wb3J0IHsgSXRlcmFibGVBcnJheUxpa2UgfSBmcm9tICcuLi90eXBlJztcbmltcG9ydCB7IERhdGFUeXBlLCBOZXN0ZWRUeXBlLCBEZW5zZVVuaW9uLCBTcGFyc2VVbmlvbiwgU3RydWN0LCBNYXBfIH0gZnJvbSAnLi4vdHlwZSc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBOZXN0ZWRWaWV3PFQgZXh0ZW5kcyBOZXN0ZWRUeXBlPiBpbXBsZW1lbnRzIFZpZXc8VD4ge1xuICAgIHB1YmxpYyBsZW5ndGg6IG51bWJlcjtcbiAgICBwdWJsaWMgbnVtQ2hpbGRyZW46IG51bWJlcjtcbiAgICBwdWJsaWMgY2hpbGREYXRhOiBEYXRhPGFueT5bXTtcbiAgICBwcm90ZWN0ZWQgX2NoaWxkcmVuOiBWZWN0b3I8YW55PltdO1xuICAgIGNvbnN0cnVjdG9yKGRhdGE6IERhdGE8VD4sIGNoaWxkcmVuPzogVmVjdG9yPGFueT5bXSkge1xuICAgICAgICB0aGlzLmxlbmd0aCA9IGRhdGEubGVuZ3RoO1xuICAgICAgICB0aGlzLmNoaWxkRGF0YSA9IGRhdGEuY2hpbGREYXRhO1xuICAgICAgICB0aGlzLm51bUNoaWxkcmVuID0gZGF0YS5jaGlsZERhdGEubGVuZ3RoO1xuICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IGNoaWxkcmVuIHx8IG5ldyBBcnJheSh0aGlzLm51bUNoaWxkcmVuKTtcbiAgICB9XG4gICAgcHVibGljIGNsb25lKGRhdGE6IERhdGE8VD4pOiB0aGlzIHtcbiAgICAgICAgcmV0dXJuIG5ldyAoPGFueT4gdGhpcy5jb25zdHJ1Y3RvcikoZGF0YSwgdGhpcy5fY2hpbGRyZW4pIGFzIHRoaXM7XG4gICAgfVxuICAgIHB1YmxpYyBpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcHVibGljIHRvQXJyYXkoKTogSXRlcmFibGVBcnJheUxpa2U8VFsnVFZhbHVlJ10+IHtcbiAgICAgICAgcmV0dXJuIFsuLi50aGlzXTtcbiAgICB9XG4gICAgcHVibGljIGluZGV4T2YoXzogVFsnVFZhbHVlJ10pOiBudW1iZXIge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vdCBpbXBsZW1lbnRlZCB5ZXRgKTtcbiAgICB9XG4gICAgcHVibGljIHRvSlNPTigpOiBhbnkgeyByZXR1cm4gdGhpcy50b0FycmF5KCk7IH1cbiAgICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBbLi4udGhpc10ubWFwKCh4KSA9PiBzdHJpbmdpZnkoeCkpLmpvaW4oJywgJyk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQoaW5kZXg6IG51bWJlcik6IFRbJ1RWYWx1ZSddIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TmVzdGVkKHRoaXMsIGluZGV4KTtcbiAgICB9XG4gICAgcHVibGljIHNldChpbmRleDogbnVtYmVyLCB2YWx1ZTogVFsnVFZhbHVlJ10pOiB2b2lkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0TmVzdGVkKHRoaXMsIGluZGV4LCB2YWx1ZSk7XG4gICAgfVxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBnZXROZXN0ZWQoc2VsZjogTmVzdGVkVmlldzxUPiwgaW5kZXg6IG51bWJlcik6IFRbJ1RWYWx1ZSddO1xuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBzZXROZXN0ZWQoc2VsZjogTmVzdGVkVmlldzxUPiwgaW5kZXg6IG51bWJlciwgdmFsdWU6IFRbJ1RWYWx1ZSddKTogdm9pZDtcbiAgICBwdWJsaWMgZ2V0Q2hpbGRBdDxSIGV4dGVuZHMgRGF0YVR5cGUgPSBEYXRhVHlwZT4oaW5kZXg6IG51bWJlcik6IFZlY3RvcjxSPiB8IG51bGwge1xuICAgICAgICByZXR1cm4gaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMubnVtQ2hpbGRyZW5cbiAgICAgICAgICAgID8gbnVsbFxuICAgICAgICAgICAgOiAodGhpcy5fY2hpbGRyZW5baW5kZXhdIGFzIFZlY3RvcjxSPikgfHxcbiAgICAgICAgICAgICAgKHRoaXMuX2NoaWxkcmVuW2luZGV4XSA9IFZlY3Rvci5jcmVhdGU8Uj4odGhpcy5jaGlsZERhdGFbaW5kZXhdKSk7XG4gICAgfVxuICAgIHB1YmxpYyAqW1N5bWJvbC5pdGVyYXRvcl0oKTogSXRlcmFibGVJdGVyYXRvcjxUWydUVmFsdWUnXT4ge1xuICAgICAgICBjb25zdCBnZXQgPSB0aGlzLmdldE5lc3RlZDtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gLTE7ICsraW5kZXggPCBsZW5ndGg7KSB7XG4gICAgICAgICAgICB5aWVsZCBnZXQodGhpcywgaW5kZXgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5pb25WaWV3PFQgZXh0ZW5kcyAoRGVuc2VVbmlvbiB8IFNwYXJzZVVuaW9uKSA9IFNwYXJzZVVuaW9uPiBleHRlbmRzIE5lc3RlZFZpZXc8VD4ge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBwdWJsaWMgdHlwZUlkczogSW50OEFycmF5O1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBwdWJsaWMgdmFsdWVPZmZzZXRzPzogSW50MzJBcnJheTtcbiAgICBjb25zdHJ1Y3RvcihkYXRhOiBEYXRhPFQ+LCBjaGlsZHJlbj86IFZlY3Rvcjxhbnk+W10pIHtcbiAgICAgICAgc3VwZXIoZGF0YSwgY2hpbGRyZW4pO1xuICAgICAgICB0aGlzLmxlbmd0aCA9IGRhdGEubGVuZ3RoO1xuICAgICAgICB0aGlzLnR5cGVJZHMgPSBkYXRhLnR5cGVJZHM7XG4gICAgfVxuICAgIHByb3RlY3RlZCBnZXROZXN0ZWQoc2VsZjogVW5pb25WaWV3PFQ+LCBpbmRleDogbnVtYmVyKTogVFsnVFZhbHVlJ10ge1xuICAgICAgICByZXR1cm4gc2VsZi5nZXRDaGlsZFZhbHVlKHNlbGYsIGluZGV4LCBzZWxmLnR5cGVJZHMsIHNlbGYudmFsdWVPZmZzZXRzKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIHNldE5lc3RlZChzZWxmOiBVbmlvblZpZXc8VD4sIGluZGV4OiBudW1iZXIsIHZhbHVlOiBUWydUVmFsdWUnXSk6IHZvaWQge1xuICAgICAgICByZXR1cm4gc2VsZi5zZXRDaGlsZFZhbHVlKHNlbGYsIGluZGV4LCB2YWx1ZSwgc2VsZi50eXBlSWRzLCBzZWxmLnZhbHVlT2Zmc2V0cyk7XG4gICAgfVxuICAgIHByb3RlY3RlZCBnZXRDaGlsZFZhbHVlKHNlbGY6IE5lc3RlZFZpZXc8VD4sIGluZGV4OiBudW1iZXIsIHR5cGVJZHM6IEludDhBcnJheSwgX3ZhbHVlT2Zmc2V0cz86IGFueSk6IGFueSB8IG51bGwge1xuICAgICAgICBjb25zdCBjaGlsZCA9IHNlbGYuZ2V0Q2hpbGRBdCh0eXBlSWRzW2luZGV4XSk7XG4gICAgICAgIHJldHVybiBjaGlsZCA/IGNoaWxkLmdldChpbmRleCkgOiBudWxsO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgc2V0Q2hpbGRWYWx1ZShzZWxmOiBOZXN0ZWRWaWV3PFQ+LCBpbmRleDogbnVtYmVyLCB2YWx1ZTogVFsnVFZhbHVlJ10sIHR5cGVJZHM6IEludDhBcnJheSwgX3ZhbHVlT2Zmc2V0cz86IGFueSk6IGFueSB8IG51bGwge1xuICAgICAgICBjb25zdCBjaGlsZCA9IHNlbGYuZ2V0Q2hpbGRBdCh0eXBlSWRzW2luZGV4XSk7XG4gICAgICAgIHJldHVybiBjaGlsZCA/IGNoaWxkLnNldChpbmRleCwgdmFsdWUpIDogbnVsbDtcbiAgICB9XG4gICAgcHVibGljICpbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYWJsZUl0ZXJhdG9yPFRbJ1RWYWx1ZSddPiB7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuICAgICAgICBjb25zdCBnZXQgPSB0aGlzLmdldENoaWxkVmFsdWU7XG4gICAgICAgIGNvbnN0IHsgdHlwZUlkcywgdmFsdWVPZmZzZXRzIH0gPSB0aGlzO1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IC0xOyArK2luZGV4IDwgbGVuZ3RoOykge1xuICAgICAgICAgICAgeWllbGQgZ2V0KHRoaXMsIGluZGV4LCB0eXBlSWRzLCB2YWx1ZU9mZnNldHMpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGVuc2VVbmlvblZpZXcgZXh0ZW5kcyBVbmlvblZpZXc8RGVuc2VVbmlvbj4ge1xuICAgIHB1YmxpYyB2YWx1ZU9mZnNldHM6IEludDMyQXJyYXk7XG4gICAgY29uc3RydWN0b3IoZGF0YTogRGF0YTxEZW5zZVVuaW9uPiwgY2hpbGRyZW4/OiBWZWN0b3I8YW55PltdKSB7XG4gICAgICAgIHN1cGVyKGRhdGEsIGNoaWxkcmVuKTtcbiAgICAgICAgdGhpcy52YWx1ZU9mZnNldHMgPSBkYXRhLnZhbHVlT2Zmc2V0cztcbiAgICB9XG4gICAgcHJvdGVjdGVkIGdldE5lc3RlZChzZWxmOiBEZW5zZVVuaW9uVmlldywgaW5kZXg6IG51bWJlcik6IGFueSB8IG51bGwge1xuICAgICAgICByZXR1cm4gc2VsZi5nZXRDaGlsZFZhbHVlKHNlbGYsIGluZGV4LCBzZWxmLnR5cGVJZHMsIHNlbGYudmFsdWVPZmZzZXRzKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGdldENoaWxkVmFsdWUoc2VsZjogTmVzdGVkVmlldzxEZW5zZVVuaW9uPiwgaW5kZXg6IG51bWJlciwgdHlwZUlkczogSW50OEFycmF5LCB2YWx1ZU9mZnNldHM6IGFueSk6IGFueSB8IG51bGwge1xuICAgICAgICBjb25zdCBjaGlsZCA9IHNlbGYuZ2V0Q2hpbGRBdCh0eXBlSWRzW2luZGV4XSk7XG4gICAgICAgIHJldHVybiBjaGlsZCA/IGNoaWxkLmdldCh2YWx1ZU9mZnNldHNbaW5kZXhdKSA6IG51bGw7XG4gICAgfVxuICAgIHByb3RlY3RlZCBzZXRDaGlsZFZhbHVlKHNlbGY6IE5lc3RlZFZpZXc8RGVuc2VVbmlvbj4sIGluZGV4OiBudW1iZXIsIHZhbHVlOiBhbnksIHR5cGVJZHM6IEludDhBcnJheSwgdmFsdWVPZmZzZXRzPzogYW55KTogYW55IHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IGNoaWxkID0gc2VsZi5nZXRDaGlsZEF0KHR5cGVJZHNbaW5kZXhdKTtcbiAgICAgICAgcmV0dXJuIGNoaWxkID8gY2hpbGQuc2V0KHZhbHVlT2Zmc2V0c1tpbmRleF0sIHZhbHVlKSA6IG51bGw7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3RydWN0VmlldyBleHRlbmRzIE5lc3RlZFZpZXc8U3RydWN0PiB7XG4gICAgcHJvdGVjdGVkIGdldE5lc3RlZChzZWxmOiBTdHJ1Y3RWaWV3LCBpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgUm93VmlldyhzZWxmIGFzIGFueSwgc2VsZi5fY2hpbGRyZW4sIGluZGV4KTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIHNldE5lc3RlZChzZWxmOiBTdHJ1Y3RWaWV3LCBpbmRleDogbnVtYmVyLCB2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgICAgIGxldCBpZHggPSAtMSwgbGVuID0gc2VsZi5udW1DaGlsZHJlbiwgY2hpbGQ6IFZlY3RvciB8IG51bGw7XG4gICAgICAgIGlmICghKHZhbHVlIGluc3RhbmNlb2YgTmVzdGVkVmlldyB8fCB2YWx1ZSBpbnN0YW5jZW9mIFZlY3RvcikpIHtcbiAgICAgICAgICAgIHdoaWxlICgrK2lkeCA8IGxlbikge1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZCA9IHNlbGYuZ2V0Q2hpbGRBdChpZHgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLnNldChpbmRleCwgdmFsdWVbaWR4XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2hpbGUgKCsraWR4IDwgbGVuKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkID0gc2VsZi5nZXRDaGlsZEF0KGlkeCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQuc2V0KGluZGV4LCB2YWx1ZS5nZXQoaWR4KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTWFwVmlldyBleHRlbmRzIE5lc3RlZFZpZXc8TWFwXz4ge1xuICAgIHB1YmxpYyB0eXBlSWRzOiB7IFtrOiBzdHJpbmddOiBudW1iZXIgfTtcbiAgICBjb25zdHJ1Y3RvcihkYXRhOiBEYXRhPE1hcF8+LCBjaGlsZHJlbj86IFZlY3Rvcjxhbnk+W10pIHtcbiAgICAgICAgc3VwZXIoZGF0YSwgY2hpbGRyZW4pO1xuICAgICAgICB0aGlzLnR5cGVJZHMgPSBkYXRhLnR5cGUuY2hpbGRyZW4ucmVkdWNlKCh4cywgeCwgaSkgPT5cbiAgICAgICAgICAgICh4c1t4Lm5hbWVdID0gaSkgJiYgeHMgfHwgeHMsIE9iamVjdC5jcmVhdGUobnVsbCkpO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgZ2V0TmVzdGVkKHNlbGY6IE1hcFZpZXcsIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNYXBSb3dWaWV3KHNlbGYgYXMgYW55LCBzZWxmLl9jaGlsZHJlbiwgaW5kZXgpO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgc2V0TmVzdGVkKHNlbGY6IE1hcFZpZXcsIGluZGV4OiBudW1iZXIsIHZhbHVlOiB7IFtrOiBzdHJpbmddOiBhbnkgfSk6IHZvaWQge1xuICAgICAgICBsZXQgdHlwZUlkcyA9IHNlbGYudHlwZUlkcyBhcyBhbnksIGNoaWxkOiBWZWN0b3IgfCBudWxsO1xuICAgICAgICBpZiAoISh2YWx1ZSBpbnN0YW5jZW9mIE5lc3RlZFZpZXcgfHwgdmFsdWUgaW5zdGFuY2VvZiBWZWN0b3IpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0eXBlSWRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkID0gc2VsZi5nZXRDaGlsZEF0KHR5cGVJZHNba2V5XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQuc2V0KGluZGV4LCB2YWx1ZVtrZXldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0eXBlSWRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkID0gc2VsZi5nZXRDaGlsZEF0KHR5cGVJZHNba2V5XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQuc2V0KGluZGV4LCB2YWx1ZS5nZXQoa2V5IGFzIGFueSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJvd1ZpZXcgZXh0ZW5kcyBVbmlvblZpZXc8U3BhcnNlVW5pb24+IHtcbiAgICBwcm90ZWN0ZWQgcm93SW5kZXg6IG51bWJlcjtcbiAgICBjb25zdHJ1Y3RvcihkYXRhOiBEYXRhPFNwYXJzZVVuaW9uPiAmIE5lc3RlZFZpZXc8YW55PiwgY2hpbGRyZW4/OiBWZWN0b3I8YW55PltdLCByb3dJbmRleD86IG51bWJlcikge1xuICAgICAgICBzdXBlcihkYXRhLCBjaGlsZHJlbik7XG4gICAgICAgIHRoaXMucm93SW5kZXggPSByb3dJbmRleCB8fCAwO1xuICAgICAgICB0aGlzLmxlbmd0aCA9IGRhdGEubnVtQ2hpbGRyZW47XG4gICAgfVxuICAgIHB1YmxpYyBjbG9uZShkYXRhOiBEYXRhPFNwYXJzZVVuaW9uPiAmIE5lc3RlZFZpZXc8YW55Pik6IHRoaXMge1xuICAgICAgICByZXR1cm4gbmV3ICg8YW55PiB0aGlzLmNvbnN0cnVjdG9yKShkYXRhLCB0aGlzLl9jaGlsZHJlbiwgdGhpcy5yb3dJbmRleCkgYXMgdGhpcztcbiAgICB9XG4gICAgcHJvdGVjdGVkIGdldENoaWxkVmFsdWUoc2VsZjogUm93VmlldywgaW5kZXg6IG51bWJlciwgX3R5cGVJZHM6IGFueSwgX3ZhbHVlT2Zmc2V0cz86IGFueSk6IGFueSB8IG51bGwge1xuICAgICAgICBjb25zdCBjaGlsZCA9IHNlbGYuZ2V0Q2hpbGRBdChpbmRleCk7XG4gICAgICAgIHJldHVybiBjaGlsZCA/IGNoaWxkLmdldChzZWxmLnJvd0luZGV4KSA6IG51bGw7XG4gICAgfVxuICAgIHByb3RlY3RlZCBzZXRDaGlsZFZhbHVlKHNlbGY6IFJvd1ZpZXcsIGluZGV4OiBudW1iZXIsIHZhbHVlOiBhbnksIF90eXBlSWRzOiBhbnksIF92YWx1ZU9mZnNldHM/OiBhbnkpOiBhbnkgfCBudWxsIHtcbiAgICAgICAgY29uc3QgY2hpbGQgPSBzZWxmLmdldENoaWxkQXQoaW5kZXgpO1xuICAgICAgICByZXR1cm4gY2hpbGQgPyBjaGlsZC5zZXQoc2VsZi5yb3dJbmRleCwgdmFsdWUpIDogbnVsbDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNYXBSb3dWaWV3IGV4dGVuZHMgUm93VmlldyB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHB1YmxpYyB0eXBlSWRzOiBhbnk7XG4gICAgcHVibGljIHRvSlNPTigpIHtcbiAgICAgICAgY29uc3QgZ2V0ID0gdGhpcy5nZXRDaGlsZFZhbHVlO1xuICAgICAgICBjb25zdCByZXN1bHQgPSB7fSBhcyB7IFtrOiBzdHJpbmddOiBhbnkgfTtcbiAgICAgICAgY29uc3QgdHlwZUlkcyA9IHRoaXMudHlwZUlkcyBhcyB7IFtrOiBzdHJpbmddOiBudW1iZXIgfTtcbiAgICAgICAgZm9yIChjb25zdCBuYW1lIGluIHR5cGVJZHMpIHtcbiAgICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IGdldCh0aGlzLCBuYW1lLCB0eXBlSWRzLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgZ2V0Q2hpbGRWYWx1ZShzZWxmOiBNYXBSb3dWaWV3LCBrZXk6IGFueSwgdHlwZUlkczogYW55LCBfdmFsdWVPZmZzZXRzOiBhbnkpOiBhbnkgfCBudWxsIHtcbiAgICAgICAgY29uc3QgY2hpbGQgPSBzZWxmLmdldENoaWxkQXQodHlwZUlkc1trZXldKTtcbiAgICAgICAgcmV0dXJuIGNoaWxkID8gY2hpbGQuZ2V0KHNlbGYucm93SW5kZXgpIDogbnVsbDtcbiAgICB9XG4gICAgcHJvdGVjdGVkIHNldENoaWxkVmFsdWUoc2VsZjogTWFwUm93Vmlldywga2V5OiBhbnksIHZhbHVlOiBhbnksIHR5cGVJZHM6IGFueSwgX3ZhbHVlT2Zmc2V0cz86IGFueSk6IGFueSB8IG51bGwge1xuICAgICAgICBjb25zdCBjaGlsZCA9IHNlbGYuZ2V0Q2hpbGRBdCh0eXBlSWRzW2tleV0pO1xuICAgICAgICByZXR1cm4gY2hpbGQgPyBjaGlsZC5zZXQoc2VsZi5yb3dJbmRleCwgdmFsdWUpIDogbnVsbDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeSh4OiBhbnkpIHtcbiAgICByZXR1cm4gdHlwZW9mIHggPT09ICdzdHJpbmcnID8gYFwiJHt4fVwiYCA6IEFycmF5LmlzQXJyYXkoeCkgPyBKU09OLnN0cmluZ2lmeSh4KSA6IEFycmF5QnVmZmVyLmlzVmlldyh4KSA/IGBbJHt4fV1gIDogYCR7eH1gO1xufVxuIl19
