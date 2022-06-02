import { Application,  Router  } from "express";
import { salaryController } from '../controllers/salary.controller';

export class AppRoutes {
       private salaryController:salaryController = new salaryController(); 
       public route(app:Application):void {
           app.get('/api/report/:date', this.salaryController.getReport);
           app.get('/pages/about', function(req, res) {
            res.render('/view/about');
          });
       }
}