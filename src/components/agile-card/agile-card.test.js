import React from 'react';
import { shallow } from 'enzyme';

import AgileCard from './agile-card';

describe('<AgileCard/>', () => {
  let fakeIssue;

  beforeEach(() => {
    fakeIssue = {
      id: 'testIssue',
      summary: 'issue summary',
      numberInProject: 123,
      project: {
        shortName: 'TT'
      },
      fields: [{
        value: {
          name: 'Critical',
          color: {id: 4, background: '#000', foreground: '#FFF'}
        },
        projectCustomField: {
          field: {
            name: 'Priority'
          }
        }
      }]
    };
  });

  it('should init', () => {
    const wrapper = shallow(<AgileCard issue={fakeIssue} />);
    wrapper.should.be.defined;
  });

  it('should show summary', () => {
    const wrapper = shallow(<AgileCard issue={fakeIssue} />);
    wrapper.find({testID: 'card-summary'}).children().should.have.text(fakeIssue.summary);
  });
});
