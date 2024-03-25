const searchItems = (items, query) => {
    query = query.toLowerCase();
    return items.filter(item => item.name.toLowerCase().includes(query));
};

module.exports = searchItems;
