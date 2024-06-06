import React from 'react'
import renderer from 'react-test-renderer'

import HomeScreen from '../screens/HomeScreen'

describe('<App />', () => {
	it('has 1 child', () => {
		const tree = renderer.create(<HomeScreen />).toJSON()
		expect(tree.children.length).toBe(1)
	})
})
