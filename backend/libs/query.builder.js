export const queryFilter = (queryParams) => {

    const { category, location } = queryParams; 
    const filter = {}; 
    if (category) {
        filter.category = category; 
    }

    if (location) {
        filter.location = location;
    }  
    
    return filter;
}; 