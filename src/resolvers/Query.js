
async function feed(parent, {filter, skip, first, orderBy}, context, info) {
  const where = filter
    ? {
        OR: [
          { url_contains: filter },
          { description_contains: filter },
        ],
      }
    : {}

  // 1
  const queriedLinks = await context.db.query.links(
    { where, skip, first, orderBy },
    `{ id }`,
  )

  // 2
  const countSelectionSet = `
    {
      aggregate {
        count
      }
    }
  `
  const linksConnection = await context.db.query.linksConnection({}, countSelectionSet)

  // 3
  return {
    count: linksConnection.aggregate.count,
    linkIds: queriedLinks.map(link => link.id),
    orderBy: orderBy || 'createdAt_DESC'
  }
}
module.exports = {
  feed,
}