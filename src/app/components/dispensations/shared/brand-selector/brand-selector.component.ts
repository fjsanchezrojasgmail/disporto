import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Brand, Product } from '../../../../bean/models/product';
import { ConstantsService } from '../../../../services/constants.service';
import { CommercialBrandDaoService } from '../../../../services/dao/commercial-brand-dao.service';
import { to2DecimalsNumber } from '../../../../utils/utils';

@Component({
  selector: 'sacyl-brand-selector',
  templateUrl: './brand-selector.component.html',
  styleUrls: ['./brand-selector.component.css']
})
export class BrandSelectorComponent {

  @Input() products!: Product[];

  @Input() disability!: number;

  @Output() modifiedResult: EventEmitter<Product[]> = new EventEmitter();

  productBrands: Record<string, Brand[]> = {};

  constructor(private brandService: CommercialBrandDaoService,
    private constantsService: ConstantsService) { }

  ngOnInit() {
    this.products.forEach(p => {
      this.brandService.getBrandByProduct(p.code).subscribe(d => {
        if (d && d.length > 0) {
          this.productBrands[p.code] = d.sort((a, b) => (a.pvp || 0) - (b.pvp || 0));
        } else {
          this.productBrands[p.code] = [];
        }
      });
    });
  }

  selectProductbrand(code: string) {
    this.products.forEach(p => {
      if (p.code === code) {
        p.pvp.value = p.brand?.pvp;
        p.pvp.valueTax = (p.brand?.pvp) ? to2DecimalsNumber(this.constantsService.getIva(this.disability, p.reducedVat) * p.brand?.pvp) : undefined;
        p.pvp.total = (p.brand?.pvp) ?
          to2DecimalsNumber(this.constantsService.getIva(this.disability, p.reducedVat) * p.brand?.pvp * p.units.value) : undefined;
      }
    });
  }

  unselectProductbrand(code: string) {
    this.products.forEach(p => {
      if (p.code === code) {
        p.pvp.value = undefined;
        p.pvp.valueTax = undefined;
        p.pvp.total = undefined;
      }
    });
  }

}
