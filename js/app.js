var Todo = React.createClass({
    
    getInitialState: function() {
        return {items: [], baseItems: []};    
    },
    
    componentDidMount: function() {
        this.setState({items: this.props.items, baseItems: this.props.items});  
    },
    
    filter: function(filterText, completed) {
        if ((!filterText || filterText == '') && completed == null) { // Not short-handed, because completed can be false/true
            this.setState({items: this.state.baseItems});
            return;
        }
        
        var filtered = this.state.baseItems.filter(function(el) {
            if (filterText == '' || el.subject.toLowerCase().indexOf(filterText) > -1) {
                if (completed == null || (completed != null && el.completed == completed)) {
                    return el;
                }
            }
        });
        
        this.setState({items: filtered});
    },
    
    setCompleted: function(item) {
        var items = [];
        this.state.baseItems.map(function(i) {
            if (i.subject == item.subject) {
                i.completed = !i.completed;   
            }
            
            items.push(i);
        });
        
        this.setState({baseItems: items});
    },
    
    render: function() {
        var completed = 0;
        var total = this.props.items.length;
        this.state.baseItems.map(function(obj) {
             if (obj.completed) completed++;
        });
        
        return (
            <div className="wrapper">
                <SearchBar onFilter={this.filter} />
                <TodoList items={this.state.items} setCompleted={this.setCompleted} />
                <TodoStatus completed={completed} total={total} />
            </div>
        );
    }
});

var SearchBar = React.createClass({
    getInitialState: function() {
        return { completed: null };  
    },
    
    handleChange: function(status) {
        var filterText = this.refs.filterText.getDOMNode().value;
        this.props.onFilter(filterText, this.state.completed);
    },
    
    statusAll: function() {
        this.setState({completed: null});
        var filterText = this.refs.filterText.getDOMNode().value;
        this.props.onFilter(filterText, null);
    },
    
    statusCompleted: function() {
        this.setState({completed: true});  
        var filterText = this.refs.filterText.getDOMNode().value;
        this.props.onFilter(filterText, true);
    },
    
    statusRemaining: function() {
        this.setState({completed: false});  
        var filterText = this.refs.filterText.getDOMNode().value;
        this.props.onFilter(filterText, false);
    },
    
    render: function() {
        return (
            <form>
                <input type="text" placeholder="Search for an item..." ref="filterText" onChange={this.handleChange} />
                <div className='statusSearch'>
                    <a href="#" onClick={this.statusAll} className={this.state.completed == null ? 'active' : ''}>ALL</a>
                    <a href="#" onClick={this.statusCompleted} className={this.state.completed == true ? 'active' : ''}>COMPLETED</a>
                    <a href="#" onClick={this.statusRemaining} className={this.state.completed == false ? 'active' : ''}>REMAINING</a>
                </div>
            </form>
        );
    }
});

var TodoList = React.createClass({
    render: function() {
        var items = this.props.items.map(function(item) {
            return <TodoItem item={item} setCompleted={this.props.setCompleted} /> 
        }, this);
        
        return (
            <div id="list">
                {items}
            </div>
        );   
    }
});

var TodoItem = React.createClass({
    getInitialState: function() {
        return {completed: false };  
    },
    
    componentDidMount: function() {
        this.setState({completed: this.props.item.completed});
    },
    
    setCompleted: function() {
        this.setState({completed: !this.state.completed});
        this.props.setCompleted(this.props.item);
    },
    
    render: function() {
        var className = 'item';
        if (this.props.item.completed) className += ' completed';
        
        return (
            <div className={className} onClick={this.setCompleted}>{this.props.item.subject}</div>
        );
    }
});

var TodoStatus = React.createClass({
    getInitialState: function() {
        return {completed:0, total:0};    
    },
    
    componentDidMount: function() {
        this.setState({completed: this.props.completed, total: this.props.total});
    },
    
    render: function() {
        return (
            <div id="footer">
                {this.props.total - this.props.completed} of {this.props.total} remaining
            </div>
        );
    }
});

var items = [
    { subject: 'Study about stock market', completed:false },
    { subject: 'Read some books', completed:false },
    { subject: 'Play tennis', completed:true },
    { subject: 'Watch House of Cards', completed:false },
    { subject: 'Write some JS code', completed:false }
];

React.render(<Todo items={items} />, document.getElementById('content'));