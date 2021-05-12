const parseRSS = (link, text) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, 'application/xml');
  //console.log(xml);

  const { documentElement } = xml;
  const { tagName } = documentElement;
  if (tagName  !== 'rss') throw new Error(`documentElement.tagName: ${tagName}`);
  const channel = documentElement.firstElementChild;
  if (channel.tagName !== 'channel') throw new Error(`documentElement.firstElementChild: ${tagName}`);
  const channelChildren = Array.from(channel.children);
  const title = channelChildren.filter((e) => e.tagName === 'title')[0].textContent;
  const description = channelChildren.filter((e) => e.tagName === 'description')[0].textContent;
  const items = channelChildren.filter((e) => e.tagName === 'item').map((e) => {
    const itemChildren = Array.from(e.children);
    const result = {
      title: itemChildren.filter((e) => e.tagName === "title")[0].textContent,
      description: itemChildren.filter((e) => e.tagName === 'description')[0].textContent,
      date: new Date(itemChildren.filter((e) => e.tagName === 'pubDate')[0].textContent),
      link: itemChildren.filter((e) => e.tagName === 'link')[0].textContent,
    };
    result.hash = () => `${result.date}${result.link}`;
    return result;
  });

  const result = {
    link,
    title,
    description,
    items
  };
  return result;
};

export default parseRSS;