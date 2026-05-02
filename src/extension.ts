import * as vscode from 'vscode'
import markdownItContainer from 'markdown-it-container'

export function activate(context: vscode.ExtensionContext) {
	return {
		extendMarkdownIt(md: any) {
			md.use(markdownItContainer, 'alert', {
				validate: () => true,
				render: (tokens: any, idx: number) => {
					return tokens[idx].nesting === 1 ? '<div class="alert">' : '</div>'
				},
			})

			md.use(markdownItContainer, 'spoiler', {
				marker: '?',
				validate: (params: string) => params.trim().match(/^spoiler\s+(.*)$/),
				render: (tokens: any, idx: number) => {
					const m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/)
					const title = m?.[1]?.trim() || 'Нажмите, чтобы раскрыть'
					return tokens[idx].nesting === 1
						? `<div class="spoiler"><details><summary>${title}</summary>`
						: `</summary></details></div>`
				},
			})

			md.inline.ruler.before(
				'text',
				'fire_sticker',
				(state: any, silent: boolean) => {
					if (state.src.slice(state.pos, state.pos + 6) !== ':fire:') {
						return false
					}

					if (!silent) {
						const token = state.push('fire_sticker', '', 0)
						token.content = '🔥'
					}

					state.pos += 6
					return true
				},
			)

			md.renderer.rules.fire_sticker = () => {
				return '<span class="sticker">🔥</span>'
			}
			const defaultFence = md.renderer.rules.fence
			md.renderer.rules.fence = (
				tokens: any,
				idx: number,
				options: any,
				env: any,
				self: any,
			) => {
				const token = tokens[idx]
				if (token.info.trim() === 'mermaid') {
					return `<div class="mermaid">${md.utils.escapeHtml(token.content)}</div>`
				}
				return defaultFence(tokens, idx, options, env, self)
			}
			return md
		},
	}
}

export function deactivate() {}
