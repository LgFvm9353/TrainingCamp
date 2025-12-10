// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import '@testing-library/jest-dom'
import { expect, test } from 'vitest'
import { render, getQueriesForElement } from '@lynx-js/react/testing-library'

import { App } from '../App.jsx'

/**
 * 这个测试不再做复杂的快照校验，
 * 仅仅确认：
 * 1. App 可以正常渲染
 * 2. 页面中出现了“Lynx 聊天室”标题
 */
test('App renders chat title', async () => {
  const elementTree = render(<App />)

  const { findByText } = getQueriesForElement(elementTree.root as any)
  const title = await findByText('Lynx 聊天室')

  expect(title).toBeInTheDocument()
})
