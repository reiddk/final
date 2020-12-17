
//I'm totally going to keep this function.
exports.sortBy = (theArray, theColumns, theDir = [])  => {
    if (theColumns.length) {
        const columnToSortBy = theColumns.pop();
        let directionToSortBy;
        if (theDir.length) {
            directionToSortBy =  theDir.pop();
        }
        //I keep using desc so I'm hard coding the exception in
        if (directionToSortBy === 'desc') {
            directionToSortBy = 'dsc';
        }
        //only allowing asc or dsc for the directionToSortBy variable
        if (!directionToSortBy ||
            (directionToSortBy !== 'asc' && directionToSortBy !== 'dsc')) {
                directionToSortBy = 'asc';
        }
        theArray.sort((objA, objB) => {
            let bValue = objB[columnToSortBy];
            let aValue = objA[columnToSortBy];
            if (!isNaN(bValue) && !isNaN(aValue)) {
                bValue = Number(bValue);
                aValue = Number(aValue);
            }

            if (directionToSortBy === 'asc') {
                if (aValue < bValue) return -1;
                if (aValue > bValue) return 1;
            } else if (directionToSortBy === 'dsc') {
                if (aValue < bValue) return 1;
                if (aValue > bValue) return -1;
            }
            return 0;
        });
        
        exports.sortBy(theArray, theColumns, theDir);
    }
}

exports.paging = (theArray, limit, offset = 0) => {
    if (limit === null || limit === undefined) {
        return theArray;
    }
    if (isNaN(limit)) {
        return theArray;
    }
    if (isNaN(offset)) {
        offset = 0;
    }
    limit = Number(limit);
    offset = Number(offset);
    return theArray.filter((value, index) => {
        if (limit <= 0) {
            return false;
        }
        if (index >= offset) {
            limit--;
            return true;
        }
        return false;
    });
}

/*
interface filter {
    key: string;
    like: string;
}
*/
exports.filtering = (theArray, filters) => {
    if (!filters || !filters.length) {
        return theArray;
    }
    return theArray.filter((value) => {
        for (const key of Object.keys(value)) {
            const tempVal = value[key];
            if (String(tempVal).toLowerCase().includes(filters.toLowerCase())) {
                return true
            }
        }
        return false;
    });
}

/*
interface queryMethods {
  sort_col: string => string[]',
  sort_dir: string => string[],
  limit: string => number,
  offset: string => number,
  ...any
}
*/
exports.runDataManipulation = (theArray, queryMethods = null) => {
    if (!queryMethods) {
        return theArray;
    }
   /* const filtersArray = [];
    for (const key in queryMethods) {
        if (!['sort_col', 'sort_dir', 'limit', 'offset'].includes(key)) {
            filtersArray.push({
                key,
                like: queryMethods[key].split('like:')[1] || queryMethods[key] 
            });
        }
    }*/
    //console.log('filtersArray', filtersArray);
    let filteredArray = exports.filtering(theArray,queryMethods.filter_str);
    //console.log('filteredArray', filteredArray);

    //console.log(queryMethods.limit, queryMethods.offset);
    let pagedArray = exports.paging(filteredArray, queryMethods.limit, queryMethods.offset);
    //console.log('pagedArray', pagedArray);

    if (queryMethods.sort_col && queryMethods.sort_dir && 
        typeof queryMethods.sort_col === 'string' && typeof queryMethods.sort_dir === 'string') {
            exports.sortBy(pagedArray, queryMethods.sort_col.split(','), queryMethods.sort_dir.split(','));
    }

    return pagedArray;
}