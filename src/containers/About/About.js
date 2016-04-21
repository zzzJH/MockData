import React, {Component} from 'react';
require('./About.scss')
export default class About extends Component {

  render() {
    return (
    	<div>
            <section id="about">
			    <div className="container">
			        <div className="row">
			            <div className="col-lg-12 text-center">
			                 <h2 className="section-heading">数据模拟平台</h2>
			                <h3 className="section-subheading text-muted"></h3>
			            </div>
			        </div>
			        <div className="row">
			            <div className="col-lg-12">
			                <ul className="timeline">


			                    <li>
			                        <div className="timeline-image">
			                            <img className="img-circle img-responsive" src="http://tx.haiqq.com/uploads/allimg/150321/1055596025-13.jpg" alt="" />
			                        </div>
			                        <div className="timeline-panel" style={{marginTop:"45px"}}>
			                            <div className="timeline-heading">
			                                <h4 className="subheading">钟嘉豪</h4>
			                            </div>
			                            <div className="timeline-body">
			                                <p className="text-muted">前端工程师</p>
			                            </div>
			                        </div>
			                    </li>

			                </ul>
			            </div>
			        </div>

			    </div>
			</section>
		</div>

    );
  }
}
