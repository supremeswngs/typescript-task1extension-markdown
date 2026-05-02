document.addEventListener('DOMContentLoaded', () => {
	if (typeof mermaid !== 'undefined') {
		mermaid.initialize({
			startOnLoad: false,
			theme: 'default',
			securityLevel: 'loose',
		})
		mermaid.run({ querySelector: '.mermaid' })
	}
})
