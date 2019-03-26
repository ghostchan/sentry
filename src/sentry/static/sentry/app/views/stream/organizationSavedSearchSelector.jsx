import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import Modal from 'react-bootstrap/lib/Modal';

import {t} from 'app/locale';
import MenuItem from 'app/components/menuItem';
import DropdownLink from 'app/components/dropdownLink';
import QueryCount from 'app/components/queryCount';
import InlineSvg from 'app/components/inlineSvg';
import Button from 'app/components/button';
import {TextField} from 'app/components/forms';
import space from 'app/styles/space';
import withApi from 'app/utils/withApi';

export default class OrganizationSavedSearchSelector extends React.Component {
  static propTypes = {
    orgId: PropTypes.string.isRequired,
    savedSearchList: PropTypes.array.isRequired,
    onSavedSearchSelect: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired,
    queryCount: PropTypes.number,
    queryMaxCount: PropTypes.number,
    searchId: PropTypes.string,
  };

  getTitle() {
    const {searchId, query, savedSearchList} = this.props;
    let result;

    if (searchId) {
      result = savedSearchList.find(search => searchId === search.id);
    } else {
      result = savedSearchList.find(search => query === search.query);
    }

    return result ? result.name : t('Custom Search');
  }

  renderList() {
    const {savedSearchList, onSavedSearchSelect} = this.props;

    if (savedSearchList.length === 0) {
      return <EmptyItem>{t("There don't seem to be any saved searches yet.")}</EmptyItem>;
    }

    return savedSearchList.map(search => (
      <StyledMenuItem onSelect={() => onSavedSearchSelect(search)} key={search.id}>
        {search.isPinned && <InlineSvg src={'icon-pin'} />}
        <span>
          <strong>{search.name}</strong>
        </span>
        <code>{search.query}</code>
      </StyledMenuItem>
    ));
  }

  render() {
    const {orgId, query, queryCount, queryMaxCount} = this.props;

    return (
      <Container>
        <StyledDropdownLink
          title={
            <span>
              <span>{this.getTitle()}</span>
              <QueryCount count={queryCount} max={queryMaxCount} />
            </span>
          }
        >
          {this.renderList()}
          <StyledMenuItem divider={true} />
          <ButtonBar>
            <SaveSearchButton query={query} orgId={orgId} />
          </ButtonBar>
        </StyledDropdownLink>
      </Container>
    );
  }
}

const SaveSearchButton = withApi(
  class SaveSearchButton extends React.Component {
    static propTypes = {
      // api: PropTypes.object.isRequired,
      query: PropTypes.string.isRequired,
      // orgId: PropTypes.string.isRequired,
    };

    constructor(props) {
      super(props);
      this.state = {
        isModalOpen: false,
        isSaving: false,
        query: props.query,
        name: '',
      };
    }

    onSubmit = e => {
      e.preventDefault();

      // TODO: implement saving
    };

    onToggle = () => {
      this.setState({
        isModalOpen: !this.state.isModalOpen,
      });
    };

    handleChangeName = val => {
      this.setState({name: val});
    };

    handleChangeQuery = val => {
      this.setState({query: val});
    };

    render() {
      const {isSaving, isModalOpen} = this.state;

      return (
        <React.Fragment>
          <Button size="xsmall" onClick={this.onToggle}>
            {t('Save Current Search')}
          </Button>
          <Modal show={isModalOpen} animation={false} onHide={this.onToggle}>
            <form onSubmit={this.onSubmit}>
              <div className="modal-header">
                <h4>{t('Save Current Search')}</h4>
              </div>

              <div className="modal-body">
                <p>{t('All team members will now have access to this search.')}</p>
                <TextField
                  key="name"
                  name="name"
                  label={t('Name')}
                  placeholder="e.g. My Search Results"
                  required={true}
                  onChange={this.handleChangeName}
                />
                <TextField
                  key="query"
                  name="query"
                  label={t('Query')}
                  value={this.props.query}
                  required={true}
                  onChange={this.handleChangeQuery}
                />
              </div>
              <div className="modal-footer">
                <Button
                  priority="default"
                  size="small"
                  disabled={isSaving}
                  onClick={this.onToggle}
                  style={{marginRight: space(1)}}
                >
                  {t('Cancel')}
                </Button>
                <Button priority="primary" size="small" disabled={isSaving}>
                  {t('Save')}
                </Button>
              </div>
            </form>
          </Modal>
        </React.Fragment>
      );
    }
  }
);

const Container = styled.div`
  & .dropdown-menu {
    max-width: 350px;
    min-width: 275px;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  & a {
    /* override shared-components.less */
    padding: ${space(0.25)} ${space(1)} !important;
  }
  & span,
  & code {
    display: block;
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: ${p => p.theme.gray5};
    padding: 0;
    background: inherit;
  }
`;

const StyledDropdownLink = styled(DropdownLink)`
  display: inline-block;
  font-size: 22px;
  color: ${p => p.theme.gray5};
  line-height: 36px;
  margin-right: 10px;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  & :hover,
  & :focus {
    color: ${p => p.theme.gray5};
  }

  & .icon-arrow-down {
    display: inline-block;
    margin-left: 5px;
    top: 0;
    vertical-align: middle;
  }
`;

const EmptyItem = styled.li`
  padding: 8px 10px 5px;
  font-style: italic;
`;

const ButtonBar = styled.li`
  padding: ${space(0.5)} ${space(1)};
  display: flex;
  justify-content: space-between;

  & a {
    /* need to override .dropdown-menu li a in shared-components.less */
    padding: 0 !important;
    line-height: 1 !important;
  }
`;
