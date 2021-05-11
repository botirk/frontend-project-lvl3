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
  const title = channelChildren.filter((e) => e.tagName === 'title')[0].innerHTML;
  const description = channelChildren.filter((e) => e.tagName === 'description')[0].innerHTML;
  const items = channelChildren.filter((e) => e.tagName === 'item').map((e) => {
    const itemChildren = Array.from(e.children);
    return {
      title: itemChildren.filter((e) => e.tagName === "title")[0].innerHTML,
      description: itemChildren.filter((e) => e.tagName === 'description')[0].innerHTML,
      link: itemChildren.filter((e) => e.tagName === 'link')[0].innerHTML
    };
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