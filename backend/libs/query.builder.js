export const queryFilter = (queryParams) => {
    console.log(queryParams)
    const { category, location } = queryParams; 
    const filter = {}; 
    if (category) {
        filter.category = category; 
    }
    if (location) {
        filter.location = location;
    }
    console.log(filter)
    return filter;
}; 