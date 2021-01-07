declare global {
  interface Array<T> {
    /**
     * Joins the array to string with '/' delimiter
     * @param this
     */
    toUrlPath<T>(this: any[]): string;

    /**
     *  Returns All the Values from  the first array that are not present in the second Array
     * @param this The Array that is returned
     * @param Compare The array that is comapring
     */
    except<T>(this: any[], Compare: T[]): T[];

    /**
     *  Returns All the Values from  the first array that are not present in the second Array
     * @param this The Array that is returned
     * @param Compare The array that is comapring
     * @param key The key by which the compare is done
     */
    exceptBy<T, Tkey extends keyof T>(this: T[], Compare: T[], key: Tkey): T[];

    /**
     * Returns the Values From the first Array that are present in the second Array
     * @param this The First Array
     * @param Compare The Second Array
     */
    intersect<T>(this: any[], Compare: T[]): T[];

    /**
     * Sorts the Array in the ascending order by the key provided if
     * Note: If no  key is provided it will sort the whole Object
     * @param this The Array that is sorting
     * @param predicate The Key on which the Sorting to be done this optional
     */
    orderBy<T, Tresult extends keyof T>(this: T[], predicate?: Tresult): T[];

    /**
     * Sorts the Array in the descending order by the key provided if
     * Note: If no  key is provided it will sort the whole Object
     * @param this The Array that is sorting
     * @param predicate The Key on which the Sorting to be done this optional
     */
    orderByDescending<T, Tresult extends keyof T>(
      this: T[],
      predicate?: Tresult
    ): T[];

    /**
     * Groups the array in group like object
     * @param this
     * @param key
     */
    groupBy<T, Tkey extends keyof T>(
      this: T[],
      key: Tkey
    ): { key: Tkey; values: T[] }[];

    /**
     * Usefull for selectiong an array in array and returns one dimensional array
     * @param this
     * @param predicate
     */
    selectMany<T, Tresult>(this: T[], predicate: Func<T, Tresult>): Tresult;

    /**
     * Retrurns true if any item in the Array mathces the callback or False if not
     * @param this The Array
     * @param predicate Callback function resulting in boolean
     */
    any<T, Tresult>(this: T[], predicate: Func<T, Tresult>): boolean;
    /**
     * Retrurns true if any item in the Array mathces the callback or False if not
     * @param this The Array
     */
    any<T, Tresult>(this: T[]): boolean;

    /**
     * Returns boolean representing all of the items match the predicate
     * @param this
     * @param predicate
     */
    all<T>(this: T[], predicate: Func<T, boolean>): boolean;

    /**
     *
     * @param this
     * @param pageSize
     * @param pageIndex
     */
    paginate(this: T[], pageSize: number, pageIndex: number): T[];

    /**
     * Transforms the array to jsonArray
     * @param this
     */
    toJson(this: T[]): string;

    /**
     * Removes the specified item
     * @param this
     * @param map
     * @param item
     */
    remove<T, Tresult>(this: T[], map: Func<T, Tresult>, item: Tresult): T[];

    /**
     * Returns an array cleared of all of the repeating keys
     * @param this
     * @param key
     */
    distinctBy<T, Tkey extends keyof T>(this: T[], key: Tkey): T[];
  }

  interface String {
    format(...params: string[]): string;
    formatArr(params: string[]): string;
  }
}

Array.prototype.toUrlPath = function <T>(): string {
  let arr = [...this];
  return arr.join('/');
};
Array.prototype.intersect = function <T>(Comparer: T[]): T[] {
  const returnArr = [];
  for (const iterator of Comparer) {
    const Index = this.indexOf(iterator);
    if (Index >= 0) {
      returnArr.push(iterator);
    }
  }
  return returnArr;
};
Array.prototype.orderBy = function <T, Tresult>(predicate?: Tresult): T[] {
  try {
    if (predicate !== null && predicate !== undefined) {
      const ordered = this.sort((a, b) => {
        if (typeof a[predicate] == 'string') {
          return a[predicate].localeCompare(b[predicate]);
        }
        return a[predicate] - b[predicate];
      });

      return ordered;
    } else {
      return this.sort((a, b) => {
        return a - b;
      });
    }
  } catch (error) {
    console.log(error);
    return this;
  }
};
Array.prototype.orderByDescending = function <T, Tresult>(
  predicate?: Tresult
): T[] {
  try {
    if (predicate !== null && predicate !== undefined) {
      return this.sort((a, b) => {
        if (typeof a[predicate] == 'string') {
          return b[predicate].localeCompare(a[predicate]);
        }
        return b[predicate] - a[predicate];
      });
    } else {
      return this.sort((a, b) => b - a);
    }
  } catch (error) {
    console.log(error);
    return this;
  }
};
Array.prototype.any = function <T, Tresult>(
  predicate?: Func<T, Tresult>
): boolean {
  if (predicate) return this.filter((x) => predicate(x)).length > 0;
  return this.length > 0;
};
Array.prototype.all = function <T>(predicate: Func<T, boolean>) {
  let arr = [...this];
  let filtered = arr.filter((x) => predicate);
  return arr.length == filtered.length;
};
Array.prototype.paginate = function <T>(
  pageSize: number,
  pageIndex: number
): T[] {
  let endIndex = pageIndex + 1;
  return this.slice(pageIndex * pageSize, endIndex * pageSize);
};
Array.prototype.toJson = function () {
  return JSON.stringify(this);
};
Array.prototype.remove = function <T, Tresult>(
  map: Func<T, Tresult>,
  item: Tresult
) {
  let arr = [...this];
  let index = arr.map(map).indexOf(item);
  if (Number.isInteger(index) && index >= 0) arr.splice(index, 1);
  return arr;
};
Array.prototype.except = function <T>(Comparer: T[]): T[] {
  for (const iterator of Comparer) {
    const Index = this.indexOf(iterator);
    if (Index >= 0) {
      this.splice(Index, 1);
    }
  }
  return this;
};
Array.prototype.exceptBy = function <T, Tkey>(Compare: any[], key: Tkey): T[] {
  for (const iterator of Compare) {
    const Index = this.map((x) => x[key]).indexOf(iterator[key]);
    if (Index >= 0) {
      this.splice(Index, 1);
    }
  }
  return this;
};
Array.prototype.groupBy = function <T, Tkey>(
  key: Tkey
): { key: Tkey; values: T[] }[] {
  let arr = [...this];
  let group: { key: Tkey; values: T[] }[] = [];
  for (const iterator of arr) {
    const keyVal = iterator[key];
    if (!group.any()) {
      group.push({ key: keyVal, values: [iterator] });
      continue;
    } else {
      let grVal = group.find((x) => x.key == keyVal);
      if (grVal) {
        grVal.values.push(iterator);
      } else {
        group.push({ key: keyVal, values: [iterator] });
      }
    }
  }
  return group;
};
Array.prototype.selectMany = function <T, Tresult>(
  predicate: Func<T, Tresult>
): Tresult {
  let selected: Tresult[] = [];
  for (const iterator of this) {
    const Item = predicate(iterator);
    selected = selected.concat(Item);
  }
  const c = selected.filter((x) => x != null);
  return c as any;
};
Array.prototype.distinctBy = function <T, Tkey>(key: Tkey): T[] {
  const arr = [...this];
  let returnArr: any[] = [];
  arr.forEach((x) => {
    if (returnArr.length == 0) {
      returnArr.push(x);
    } else {
      let found = returnArr.find((c) => c[key] == x[key]);
      if (!found) returnArr.push(x);
    }
  });

  return returnArr;
};

String.prototype.format = function (...params: string[]): string {
  return this.replace(/{(\d+)}/g, function (match, number) {
    return typeof params[number] != 'undefined' ? params[number] : match;
  });
};
String.prototype.formatArr = function (params: string[]): string {
  return this.replace(/{(\d+)}/g, function (match, number) {
    return typeof params[number] != 'undefined' ? params[number] : match;
  });
};
declare global {
  type Func<T, Tresult> = (item: T) => Tresult;
}

export class Extensions {}

export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      if (name !== 'constructor') {
        derivedCtor.prototype[name] = baseCtor.prototype[name];
      }
    });
  });
}
