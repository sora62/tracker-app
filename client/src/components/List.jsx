import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Accordion, AccordionDetails, AccordionSummary, Typography, Chip, Stack, Checkbox, Container,
} from '@mui/material';
import { orange } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import moment from 'moment';
import axios from 'axios';
import CodeSnippetEditor from './CodeSnippetEditor';
import { deleteProblem, updateCode, updateCheckmark } from '../features/userDataSlice';

function List({ listId, list, index }) {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const [checked, setChecked] = useState(list.checkmark);
  const [note, setNote] = useState(list.note);
  const [showCode, setShowCode] = useState(false);

  const getColor = () => {
    if (list.difficulty === 'Easy') {
      return { bg: '#00AF9B26', color: '#00af9b' };
    } if (list.difficulty === 'Medium') {
      return { bg: '#FFB80026', color: '#FFB800' };
    } if (list.difficulty === 'Hard') {
      return { bg: '#FF2D5526', color: '#ff2d55' };
    }
    return '#757575';
  };

  const handleToggleCheckmark = (e) => {
    e.stopPropagation();
    const newChecked = !checked;
    setChecked(newChecked);
    const data = { id: listId, index, checkmark: newChecked };
    axios.put(`/api/users/${listId}/lists/checkmark`, data)
      .then(() => {
        dispatch(updateCheckmark(data));
      })
      .catch((err) => console.log('Err in update checkmark: ', err));
  };

  const handleSaveNote = () => {
    const data = { id: listId, index, note };
    axios.put(`/api/users/${listId}/lists/note`, data)
      .then(() => {
        alert('Successfully updated!');
      })
      .catch((err) => console.log('Err in save note: ', err));
  };

  const handleDeleteProblem = () => {
    const data = { id: listId, index };
    axios.put(`/api/users/${listId}/lists/delete`, data)
      .then(() => {
        dispatch(deleteProblem({ index }));
      })
      .catch((err) => console.log('Err in delete problem: ', err));
  };

  const handleCodeClick = async (e) => {
    e.stopPropagation();
    setShowCode(!showCode);
  };

  const handleSaveCode = (code) => {
    const data = { id: listId, index, code };
    axios.put(`/api/users/${listId}/lists/code`, data)
      .then(() => {
        dispatch(updateCode(data));
      })
      .catch((err) => console.log('Err in update code: ', err));
  };

  const handleChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <Accordion expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${index}bh-content`}
          id={`panel${index}bh-header`}
        >
          <div onClick={handleToggleCheckmark}>
            <Checkbox checked={checked} inputProps={{ 'aria-label': 'controlled' }} sx={{ color: orange[600], '&.Mui-checked': { color: orange[400] } }} />
          </div>
          <Typography className="list-title-box" sx={{ width: '40%', display: 'flex', alignItems: 'center' }}>
            <a href={list.link} target="_blank" onClick={(e) => e.stopPropagation()} rel="noreferrer">{list.title}</a>
          </Typography>
          <Stack direction="row" alignItems="center" width="13%">
            <Chip label={list.difficulty} className="diff-chip" sx={{ backgroundColor: getColor().bg, color: getColor().color }} />
          </Stack>
          <Stack direction="row" alignItems="center" width="30%" spacing={1} sx={{ flexWrap: 'wrap', gap: '5px' }}>
            {list && list.tag.map((item) => (<Chip key={item} label={item} className="tag-chip" />))}
          </Stack>
          <Typography sx={{ display: 'flex', ml: 2, alignItems: 'center' }}>
            <button className="code-btn" type="button" onClick={handleCodeClick}>
              <span className="code-span">
                <svg className="code-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path fill="currentColor" d="M24 12l-5.657 5.657-1.414-1.414L21.172 12l-4.243-4.243 1.414-1.414L24 12zM2.828 12l4.243 4.243-1.414 1.414L0 12l5.657-5.657L7.07 7.757 2.828 12zm6.96 9H7.66l6.552-18h2.128L9.788 21z" />
                </svg>
                Code
              </span>
            </button>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Container sx={{
            minHeight: '70px', position: 'relative', display: 'flex', flexDirection: 'column',
          }}
          >
            <div className="note-header">
              <small>Note:</small>
              <small>{list && moment(list.date).fromNow()}</small>
            </div>

            {list && (
            <ReactQuill value={note} onChange={(value) => setNote(value)} />
            )}
            <div className="shared-btn-box">
              <button className="shared-btn" id="save-btn" type="button" onClick={handleSaveNote}>
                <p className="shared-text"> Save </p>
                <span className="shared-icon-box">
                  <svg className="shared-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                </span>
              </button>
              <button className="shared-btn" type="button" onClick={handleDeleteProblem}>
                <p className="shared-text"> Delete </p>
                <span className="shared-icon-box">
                  <svg className="shared-icon" width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </div>
          </Container>
        </AccordionDetails>
      </Accordion>
      {showCode && list
      && (
      <CodeSnippetEditor
        setShowCode={setShowCode}
        codeData={list.code}
        handleSaveCode={handleSaveCode}
      />
      )}
    </>
  );
}

export default List;
