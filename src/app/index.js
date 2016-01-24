import * as dom from '../dom'
import {diffNode} from '../diff'

/**
 * Create a DOM renderer using a container element. Everything will be rendered
 * inside of that container. Returns a function that accepts new state that can
 * replace what is currently rendered.
 */

export function create (container, dispatch, options = {}) {
  let oldVnode = null
  let node = null
  let rootId = options.id || '0'

  if (container && container.childNodes.length > 0) {
    container.innerHTML = ''
  }

  let update = (newVnode) => {
    let changes = diffNode(oldVnode, newVnode, rootId)
    node = changes.reduce(dom.update(dispatch), node)
    oldVnode = newVnode
    return node
  }

  let create = (vnode) => {
    node = dom.create(vnode, rootId, dispatch)
    if (container) container.appendChild(node)
    oldVnode = vnode
    return node
  }

  return (vnode) => {
    return node !== null
      ? update(vnode)
      : create(vnode)
  }
}
