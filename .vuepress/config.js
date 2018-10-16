module.exports = {
    title: "Services Documentation",
    description: "osCloud Services Documentation",
    themeConfig: {
      logo: '/icon-text-side-dark.png',
      sidebar: 'auto',
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Docs',
          items: [ { text: 'Architecture Reference', items: [ { text: 'osConnect', link: '/docs/architecture/osConnect/' }, { text: 'osProtect', link: '/docs/architecture/osProtect/' } ] },
               {text: 'Policy Reference', items: [ { text: 'Peering', link: '/docs/peering/' }, { text: 'Routing', link: '/docs/routing/' } ] }
            ]
          },
          { text: 'Portal', link '/portal/'},
        { text: 'Omnficent Systems', link: 'https://www.omnificentsystems.com' }
        ]
      }
    };
