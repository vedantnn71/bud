![](https://user-images.githubusercontent.com/70624701/205416407-dfdbe14d-816f-4e33-aad6-be6f49e64bde.png)

<p align="center">
    <img src="https://img.shields.io/tokei/lines/github/vedantnn71/beacon">
    <img src="https://img.shields.io/github/languages/top/vedantnn71/beacon">
    <a href="https://discord.gg/jXpsbRU2Rr">
      <img src="https://img.shields.io/badge/discord-join-blue" />
    </a>
</p>

Beacon is an analytics tool that you always wanted to use, it's minimal, fast and privacy focused. It's script is < 1.3kb and doesn't affect your page load times at all.

> NOTE: Beacon is highly under development and not in condition to use right now.

# Features
- [x] ⚡ Blazing fast tracking script (1.2kb)
- [x] ☘️ Simple and minimal ui, no bs
- [x] 🔒 Privacy friendly; no one tracked is identifiable, you own your data 
- [ ] 🚀 Command + K Launcher to get things done blazingly fast
- [x] ✨ Just add the script snippet to your site and you're good to go! Dashboard will get automatically created for you!
- [ ] 🌠 Share screenshots for your analytics in one click!
- [ ] 📈 Get sharable links and share your dashboard with other people
- [ ] 🤟 Framework agnostic tracking packages

# Monorepo

- `web`: The beacon web app.

## /packages

- `ui`: Reusable components for react
- `config`: Config for tailwind, postcss, etc for whole project.
- `auth`: Next auth related configs and util functions
- `db`: Prisma config and client
- `tracker`: The source code for tracker script
- `basics`: Framework & runtime agnostic utility functions.
