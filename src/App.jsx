/*
  Task: 
    Enable your users to sort columns in the table by clicking on 
    a column's header.

    - import hook:
        import { useSort } from '@table-library/react-table-library/sort';

    - see https://www.robinwieruch.de/react-table-sort/

    - mui migration from V4 to V5 - https://mui.com/material-ui/migration/migration-v4/
       npm install @mui/icons-material
         or this :

      npm install @mui/material @mui/styles
      npm install @emotion/react @emotion/styled
====================================================
Previous Task: 
    Enable users to select a row in the table by either clicking 
    the row or clicking a checkbox using custom select components. 
    (MaterialCheckbox)

    - https://mui.com/material-ui/getting-started/installation/
    - npm install @mui/material @emotion/react @emotion/styled

    - Material UI uses Emotion as its default styling engine. 
      If you want to use styled-components instead, run one of 
      the following commands:
      npm install @mui/material @mui/styled-engine-sc styled-components
  ================================================
  Previous Task: 
    Enable users to select a row in the table by either clicking 
    the row or clicking a checkbox.

*/
import * as React from 'react';
import './App.css'
import { useTheme } from '@table-library/react-table-library/theme';

import { useRowSelect, //will enable users to select a row
         HeaderCellSelect,
         CellSelect,
         SelectTypes,
       //  SelectClickTypes, //enforce a row select only by checkbox 
                           //and not by row click too:
} from '@table-library/react-table-library/select';

//replace the select components entirely with custom components.
import MaterialCheckbox from '@mui/material/Checkbox';

//Import stuff from React Table Library
import {
  Table,
  Header,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell,
} from '@table-library/react-table-library/table';

//Sort stuff
import { useSort,
         HeaderCellSort,
   } from '@table-library/react-table-library/sort';

//Sometimes we want to use custom sort icon
import MaterialButton from '@mui/material/Button';
import UnfoldMoreOutlinedIcon from '@mui/icons-material/UnfoldMoreOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

const list = [
  {
    id: '1',
    name: 'VSCode',
    deadline: new Date(2020, 1, 17),
    type: 'SETUP',
    isComplete: true,
  },
  {
    id: '2',
    name: 'JavaScript',
    deadline: new Date(2020, 2, 28),
    type: 'LEARN',
    isComplete: true,
  },
  {
    id: '3',
    name: 'React',
    deadline: new Date(2020, 3, 8),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '4',
    name: 'Redux',
    deadline: new Date(2023, 3, 8),
    type: 'Install',
    isComplete: false,
  },
  {
    id: '5',
    name: 'Angular',
    deadline: new Date(2024, 5, 10),
    type: 'Test',
    isComplete: false,
  }
];

const THEME = {
  BaseRow: `
    font-size: 14px;
  `,
  HeaderRow: `
    background-color: #eaf5fd;
  `,
  Row: `
    &:nth-child(odd) {
      background-color: #d2e9fb;
    }

    &:nth-child(even) {
      background-color: #eaf5fd;
    }
  `,
};
const App = () => {
  //list is renamed to "nodes". Nodes is a property of data
  //Nodes are the items in our list. In this example
  //"data" is prop to the Table component.
  const data = { nodes: list }; 


  //Using theme
  const theme = useTheme(THEME);

  //Initialize useRowSelect with table data
  //and create notifier to get selected rows from table
  //using useRowSelect() hook

  /*  If a user clicks on a row, it selects only 
    one row. If a user clicks on multiple checkboxes, it keeps 
    the selection state over multiple rows. 
      If you want to change the default single/multi select 
    behavior, then you could use the useRowSelect() hook options. 
    In this way, you can inverse the behavior (example below), 
    or enforce only single or multi select:
  */
  const select = useRowSelect(data, 
    {
    onChange: onSelectChange,
    },
    {
      rowSelect: SelectTypes.MultiSelect,
      buttonSelect: SelectTypes.SingleSelect,
    }
  );

  /*  If you don't want to have the seamless transition from single 
    select to multi select, you can disable the carry-forward feature.
    By doing this, when a user performs a single select followed by 
    a multi select, the multi select will exclude the previous 
     single select in its final selection state:
  */
  // const select = useRowSelect(
  //   data,
  //   {
  //     onChange: onSelectChange,
  //   },
  //   {
  //     isCarryForward: false,
  //   }
  // );

  /* By using the selection options, we can enforce a row 
     select only by checkbox and not by row click too:
  */
  // const select = useRowSelect(
  //   data,
  //   {
  //     onChange: onSelectChange,
  //   },
  //   {
  //     clickType: SelectClickTypes.ButtonClick,
  //   }
  // );

 /*
   Sometimes a user wants to have an initial select state. 
   This can be achieved with the useRowSelect hook too, by 
   passing in a default selection state:
 */
    // default single select
    // const select = useRowSelect(data, {
    //   state: { id: '1' },
    //   onChange: onSelectChange,
    // });

    // default multi select
    // const select = useRowSelect(data, {
    //   state: { ids: ['2', '3'] },
    //   onChange: onSelectChange,
    // });

  //This is the callback function. It gives you access to the 
  //"action" which triggered the selection change and to the 
  //current selection "state" of your table.
  function onSelectChange(action, state){
     console.log(action, state);
  }

  //Sort stuff
  //Initialize the useSort() hook then convert table
  //header columns to sortable header columns.
  //Next import HeaderCellSort
  //Next create sort functions for each sort key
  //Sometimes users want a default sort state
  const sort = useSort(data,
    {
      //declaring TYPE as default sort state
      state:{
        sortKey: 'TYPE',
        reverse: false,
      },
      //onChange callback function
      onChange: onSortChange, //Notifier to get the current sort from the table
    }, 
    {
    sortIcon: {
      margin: '0px',
      iconDefault: <UnfoldMoreOutlinedIcon />,
      iconUp: <KeyboardArrowUpOutlinedIcon />,
      iconDown: (
        <KeyboardArrowDownOutlinedIcon />
      ),
    },  
    sortFns:
     {
      TASK: (array) =>
        array.sort((a, b) => a.name.localeCompare(b.name)),
      DEADLINE: (array) =>
        array.sort((a, b) => a.deadline - b.deadline),
      TYPE: (array) =>
        array.sort((a, b) => a.type.localeCompare(b.type)),
      COMPLETE: (array) =>
        array.sort((a, b) => a.isComplete - b.isComplete),
     }
    },
  );

  //Notifier to get the current sort from the table
  //The onChange callback function gives you access to the action
  //that trigered the sort and the current sort state
  function onSortChange(action, state) {
    console.log(action, state);
  }

  /*Table component accepts {data} object as prop with
      "nodes property". Theme is another prop.
    First, the top-level checkbox in the header "<HeaderCellSelect />
    of our table enables a user to select all rows by checkbox, 
    and it also allows a user to unselect all the rows.

    Second, each table row has a checkbox for selecting itself. 
       <CellSelect item={item}
    You may notice that the row select and the checkbox select 
    behave a little different by default: whereas the row select 
    acts as a single select, the checkbox acts as multi select.

    In other words, if a user clicks on a row, it selects only 
    one row. If a user clicks on multiple checkboxes, it keeps 
    the selection state over multiple rows. If you want to 
    change the default single/multi select behavior, then you 
    could use the useRowSelect options. In this way, you can 
    inverse the behavior (example below), or enforce only single 
    or multi select:

    Finally, with React Table Library it's possible to replace 
    the select components entirely with custom components.
    The following example shows how to use Material UI components 
    with React Table Library.
  */ 

    const getIcon = (sortKey) => {
      if (sort.state.sortKey === sortKey && sort.state.reverse) {
        return <KeyboardArrowDownOutlinedIcon />;
      }
  
      if (sort.state.sortKey === sortKey && !sort.state.reverse) {
        return <KeyboardArrowUpOutlinedIcon />;
      }
  
      return <UnfoldMoreOutlinedIcon />;
    };
  return (
      <Table data={data} theme={theme} select={select} sort={sort}> 
        {(tableList) => (
          <> 
            <Header>
              <HeaderRow>
              
              <HeaderCell stiff>
                <MaterialCheckbox
                  size="small"
                  checked={select.state.all}
                  indeterminate={
                    !select.state.all && !select.state.none
                  }
                  onChange={select.fns.onToggleAll}
                />
                <MaterialButton
                  fullWidth
                  style={{ justifyContent: 'flex-start' }}
                  endIcon={getIcon('TASK')}
                  onClick={() =>
                    sort.fns.onToggleSort({
                      sortKey: 'TASK',
                    })
                  }
                >
                  Task
                </MaterialButton>
              </HeaderCell>                  
                <HeaderCellSort sortKey="TASK">Task </HeaderCellSort>
                <HeaderCellSort sortKey="DEADLINE">Deadline</HeaderCellSort>
                <HeaderCellSort sortKey="TYPE">Type</HeaderCellSort>
                <HeaderCellSort sortKey="COMPLETE">Complete</HeaderCellSort>
              </HeaderRow>
            </Header>
            <Body>
              {tableList.map((item) => (
                <Row key={item.id} item={item}>
                    <Cell stiff>
                        <MaterialCheckbox
                        size="small"
                        checked={select.state.ids.includes(
                          item.id
                        )}
                        onChange={() =>
                          select.fns.onToggleById(item.id)
                        }
                      />
                    </Cell>

                    <Cell>{item.name}</Cell>
                    <Cell>
                      {item.deadline.toLocaleDateString('en-US',
                          {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          }
                        )}
                    </Cell>
                    <Cell>{item.type}</Cell>
                    <Cell> 
                      {item.isComplete.toString()} 
                    </Cell>
                </Row>

              ))}
          </Body>
       </> //EOF Fragment
      )}

    </Table>  );
};


export default App
