import React, {Component, PropTypes} from 'react'
import ReactTestUtils from 'react/lib/ReactTestUtils'
import About from 'containers/About/About'

describe("about-test", () => {
    var AboutInstance;
    beforeEach(() => {
        AboutInstance = ReactTestUtils.renderIntoDocument(<About />);
    }); 
    it("text correct", () => {
    	var sectionHeading = ReactTestUtils.findRenderedDOMComponentWithClass(AboutInstance, 'section-heading');
    	var subheading = ReactTestUtils.findRenderedDOMComponentWithClass(AboutInstance, 'subheading');
    	expect(sectionHeading.innerHTML).toEqual('数据模拟平台');
    	expect(subheading.innerHTML).toEqual('钟嘉豪');
    });
});
